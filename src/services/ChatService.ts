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
  when,
} from "mobx";
import toastService from "./ToastService";
import { captureException, captureEvent } from "@sentry/react-native";

export type IMessage = {
  createdAt: string;
  content: string;
  role: "system" | "user" | "assistant";
};

export type IChatListItem = {
  threadId: string;
  topic?: string;
  messages: IMessage[];
  date: string;
  modified?: number;
};

export type Prompt = {
  title: string;
  prompt: string;
  message: string;
};

export type Category = {
  [key: string]: Prompt[];
};

export class ChatService {
  conversations: IChatListItem[] = [];
  _activeChat: IChatListItem | null = null;
  streamingMessage: string = "";
  activeThreadId: string | null = null;
  // TODO: add a loading state to the UI
  isLoading: boolean = false;
  stopReason: "ended" | "length" = "ended";
  timeout: ReturnType<typeof setTimeout> | null = null;
  categories: Category = {};
  upsellReason: string = "";

  // private
  private fetchingChats: boolean = false;

  constructor() {
    makeObservable(this, {
      // observables
      _activeChat: observable,
      activeChat: computed,
      activeThreadId: observable,
      categories: observable,
      conversations: observable,
      stopReason: observable,
      streamingMessage: observable,
      upsellReason: observable,
      // actions
      setActiveChat: action,
      setActiveThreadId: action,
      setStreamingMessage: action,
      dismissUpsell: action,
      // generators
      createConversation: flow,
      fetchCategories: flow,
      fetchConversations: flow,
      init: flow,
    });

    when(
      () => userService.user !== null && userService.accessToken !== null,
      async () => await this.init()
    );
  }

  init = flow(function* (this: ChatService) {
    yield this.fetchConversations();
    yield this.fetchCategories();
  });

  fetchCategories = flow(function* (this: ChatService) {
    try {
      const response = yield fetch(`${API_URL}/chat/templates`, {
        method: "GET",
      });

      const json = yield response.json();

      runInAction(() => {
        this.categories = json;
      });
    } catch (error) {
      captureException(error, {
        tags: { error: "fetch_categories" },
        user: userService.user,
      });
    }
  });

  fetchConversations = flow(function* (this: ChatService, retry = true) {
    if (this.fetchingChats || !userService.user) return;
    try {
      this.fetchingChats = true;
      const token = yield userService.getTokens();
      const headers = buildHeaders({
        token,
        email: userService.user.email,
        uid: userService.user.providerData[0].uid,
      });

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
      console.error("[ChatService].Err", error);
      captureException(error, {
        tags: { error: "fetch_conversations" },
        user: userService.user,
      });
    } finally {
      this.fetchingChats = false;
    }
  });

  createConversation = flow(function* (
    this: ChatService,
    { topic = "", message = "" }: { topic?: string; message?: string }
  ) {
    if (!userService.user) return null;
    try {
      const token = yield userService.getTokens();
      const headers = buildHeaders({
        token,
        email: userService.user.email,
        uid: userService.user.providerData[0].uid,
      });
      const reqParams = {
        method: "POST",
        headers,
        body: JSON.stringify({ topic, message }),
      };

      const response = yield fetch(`${API_URL}/chat/new`, reqParams);
      const json = yield response.json();

      if (json.statusCode === 403) {
        throw new Error("Unauthorized");
      }
      if (response.status === 402) {
        this.onError({ topic: json.reason });
        toastService.show(json.data as string, "error");
        return;
      }
      if (!json.data?.threadId) {
        captureException(json, {
          tags: { error: "create_conversation" },
          user: userService.user,
        });
        throw new Error("Failed to create a new chat");
      }
      runInAction(() => {
        this.conversations = [
          ...this.conversations,
          {
            threadId: json?.data?.threadId,
            messages: [],
            date: new Date().toISOString(),
          },
        ];
      });
      this.setActiveThreadId(json.data.threadId as string);

      if (topic) {
        this.appendMessageToThread({
          content: topic,
          createdAt: new Date().toISOString(),
          role: "user",
        });
      }

      if (message) {
        this.appendMessageToThread({
          content: message,
          createdAt: new Date().toISOString(),
          role: "user",
        });
      }

      this.fetchConversations();

      return json.data.threadId;
    } catch (error) {
      toastService.show(
        "Failed to create a new chat. Please try again later.",
        "error"
      );
      captureException(error, {
        tags: { error: "create_conversation" },
        user: userService.user,
      });
      console.error("[ChatService].Err", error);
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

  dismissUpsell = () => {
    this.upsellReason = "";
  };

  private readonly onError = (error) => {
    if (error?.topic) {
      if (error.topic === "monthly_limit_reached") {
        runInAction(() => {
          this.upsellReason = "monthly_limit_reached";
        });
      }

      if (error.topic === "max_messages_reached") {
        runInAction(() => {
          this.upsellReason = "max_messages_reached";
        });
      }
      return;
    }

    if (error && error.status === 403) {
      toastService.show(
        "It seems your session has expired. Please login again.",
        "error"
      );

      return;
    }

    toastService.show("Something went wrong. Please try again later.", "error");
  };

  private readonly eventSource = flow(function* (
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
      // message received no need to keep the loader going
      clearTimeout(service.timeout);
      service.timeout = setTimeout(resetState, 10000);

      if (e.data === "max_messages_reached") {
        captureEvent({
          message: "Max messages reached",
          level: "info",
          extra: { threadId: service.activeThreadId },
          user: userService.user,
        });
        return service.onError({ topic: "max_messages_reached" });
      }

      // Assuming we receive JSON-encoded data payloads:
      const fragments = e.data;

      if (isJson(fragments)) {
        const payload = JSON.parse(fragments);
        const messageChunk = payload.choices[0].delta.content;
        if (messageChunk) {
          service.setStreamingMessage(service.streamingMessage + messageChunk);
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

      if (fragments.includes("[DONE]")) {
        service.appendMessageToThread({
          content: service.streamingMessage,
          createdAt: new Date().toISOString(),
          role: "system",
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
      captureException(e, {
        tags: { error: "event_source" },
        user: userService.user,
      });
      toastService.show(
        "Failed to receive result, pleas reload the conversation",
        "error"
      );
      service.onError(e);
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

  continueStream = () => {
    this.eventSource({
      message: "continue",
      topic: "",
    });
  };

  endStream() {
    runInAction(() => {
      this.stopReason = "ended";
    });
  }
}

const chatService = new ChatService();

export default chatService;
