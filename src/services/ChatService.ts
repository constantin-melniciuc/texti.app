import { API_URL } from "@env";
import userService from "./UserService";
import { buildHeaders, isJson } from "./utils";
import RNEventSource, {
  CustomEvent,
  EventSourceListener,
} from "react-native-sse";
import "react-native-url-polyfill/auto";
import {
  makeObservable,
  observable,
  action,
  flow,
  computed,
  runInAction,
} from "mobx";

export interface IMessage {
  createdAt: string;
  content: string;
  role: "system" | "user" | "assistant";
}

export interface IChatListItem {
  threadId: string;
  topic?: string;
  messages: IMessage[];
  date: string;
  modified?: number;
}

export class ChatService {
  conversations: IChatListItem[] = [];
  _activeChat: IChatListItem | null = null;
  streamingMessage: string = "";
  activeThreadId: string | null = null;
  // TODO: add a loading state to the UI
  isLoading: boolean = false;
  // TODO: add can continue to the UI
  stopReason: "ended" | "length" = "ended";
  timeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    makeObservable(this, {
      conversations: observable,
      activeThreadId: observable,
      setStreamingMessage: action,
      streamingMessage: observable,
      _activeChat: observable,
      stopReason: observable,
      activeChat: computed,
      setActiveChat: action,
      setActiveThreadId: action,
      init: action,
      fetchConversations: flow,
      createConversation: flow,
      eventSource: flow,
    });
  }

  init() {
    this.fetchConversations();
  }

  fetchConversations = flow(function* (this: ChatService, retry = true) {
    try {
      const token = yield userService.getTokens();
      const headers = buildHeaders({
        token,
        email: userService.user.email,
        uid: userService.user.providerData[0].uid,
      });

      console.log(`>[chatservice][API]: ${API_URL}/chat/all`);

      const response = yield fetch(`${API_URL}/chat/all`, {
        method: "GET",
        headers,
      });
      const json = yield response.json();
      if (json.statusCode === 403 && retry) {
        return yield this.fetchConversations(false);
      }
      runInAction(() => {
        this.conversations = json.data;
      });
      return json.data;
    } catch (error) {
      console.log("[chatservice]", error);
    }
  });

  createConversation = flow(function* (this: ChatService, retry = true) {
    try {
      const token = yield userService.getTokens();
      const headers = buildHeaders({
        token,
        email: userService.user.email,
        uid: userService.user.providerData[0].uid,
      });

      const response = yield fetch(`${API_URL}/chat/new`, {
        method: "POST",
        headers,
      });
      const json = yield response.json();
      if (json.statusCode === 403) {
        throw new Error("Unauthorized");
      }
      yield this.fetchConversations(false);
      this.setActiveThreadId(json.data.threadId);

      return json.data.threadId;
    } catch (error) {
      console.log(error);
    }
  });

  setActiveChat(chat: IChatListItem | null) {
    this._activeChat = chat;
  }

  get activeChat() {
    return this._activeChat || ({} as IChatListItem);
  }

  setStreamingMessage(message: string) {
    this.streamingMessage = message;
  }

  setActiveThreadId(threadId: string) {
    this.activeThreadId = threadId;
    this.setActiveChat(
      this.conversations.find(
        (conversation) => conversation.threadId === threadId
      ) || null
    );
  }

  // @TODO: base on the error message show an alert / upsell / new chat etc.
  _onError(error) {
    console.log(">> onError", error);
    if (error && error.topic) {
      if (error.topic === "monthly_limit_reached") {
        // this._showMonthlyLimitReached();
      }

      if (error.topic === "max_messages_reached") {
        // this._showMaxMessagesReached();
      }
      return;
    }

    if (error && error.status === 403) {
      // this._alert.show({
      //   message: "It seems your session has expired. Please login again.",
      //   type: "error",
      // });

      return;
    }

    // this._alert.show({
    //   message: "Something went wrong. Please try again later.",
    //   type: "error",
    // });
  }

  eventSource = flow(function* (
    this: ChatService,
    {
      message,
      topic,
    }: {
      message: string;
      topic: string;
    }
  ) {
    const $threadId = encodeURIComponent(this.activeThreadId);
    const $message = encodeURIComponent(message);
    const $topic = encodeURIComponent(topic);
    const token = yield userService.getTokens();
    const headers = buildHeaders({
      token,
      email: userService.user.email,
      uid: userService.user.providerData[0].uid,
    });

    this.isLoading = true;

    const source = new RNEventSource(
      `${API_URL}/chat/stream?threadId=${$threadId}&message=${$message}&topic=${$topic}`,
      {
        headers,
      }
    );
    const service = this;

    const resetState = () => {
      this.isLoading = false;
      source.close();
    };

    service.timeout = setTimeout(resetState, 10000);

    const messageListener: EventSourceListener<"message"> = function (
      e: CustomEvent<"message">
    ) {
      console.log(">> event", e.type);
      // message received no need to keep the loader going
      clearTimeout(service.timeout);
      service.timeout = setTimeout(resetState, 10000);

      if (e.data === "max_messages_reached") {
        return service._onError({ topic: "max_messages_reached" });
      }

      // Assuming we receive JSON-encoded data payloads:
      const fragments = e.data.split("data: ").filter((piece) => piece);

      fragments.forEach((fragment) => {
        if (isJson(fragment)) {
          const payload = JSON.parse(fragment);
          const messageChunk = payload.choices[0].delta.content;
          if (messageChunk) {
            service.setStreamingMessage(
              service.streamingMessage + messageChunk
            );
          }

          const finishReason = payload.choices[0].finish_reason;
          if (finishReason === "length") {
            // we can continue button and do something
            runInAction(() => {
              service.stopReason = "length";
            });
          } else {
            runInAction(() => {
              service.stopReason = "ended";
            });
          }
        }
      });

      if (fragments && fragments.some((chunk) => chunk.includes("[DONE]"))) {
        service.appendMessageToThread({
          content: service.streamingMessage,
          createdAt: new Date().toISOString(),
          role: "assistant",
        });
        runInAction(() => {
          service.stopReason = "ended";
        });
        service.setStreamingMessage("");
        resetState();
      }
    };
    const errorListener: EventSourceListener<"error"> = function (
      e: CustomEvent<"error">
    ) {
      // errorTracker.trackError(e, { source: "eventSource", threadId });
      // error received
      service._onError(e);
      resetState();
    };
    source.addEventListener("message", messageListener);

    source.addEventListener("error", errorListener);
  });

  private appendMessageToThread(message: IMessage) {
    if (this._activeChat) {
      const modifiedChat: IChatListItem = {
        ...this._activeChat,
        messages: [...this._activeChat.messages, message],
      };
      this.setActiveChat(modifiedChat);
    }
  }

  sendMessage(message: string) {
    if (!this.activeChat) return null;

    this.appendMessageToThread({
      content: message,
      createdAt: new Date().toISOString(),
      role: "user",
    });

    this.eventSource({ message, topic: this.activeChat.topic });
  }

  continueStream() {
    this.eventSource({
      message: "continue",
      topic: "",
    });
  }

  endStream() {
    runInAction(() => {
      this.stopReason = "ended";
    });
  }
}

const chatService = new ChatService();

export default chatService;
