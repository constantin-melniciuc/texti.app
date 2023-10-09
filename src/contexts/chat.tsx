import { useEffect, useContext, createContext, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import chatService, { IChatListItem } from "../services/ChatService";

const ChatContext = createContext<{
  chats: IChatListItem[];
  refetchChats: () => Promise<void>;
}>(null);

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider(props) {
  const [chats, setChats] = useState<IChatListItem[]>([]);

  async function refetchChats() {
    await chatService.fetchConversations();
    setChats(chatService.conversations);
  }

  useEffect(() => {
    refetchChats();
  }, []);

  async function onAuthStateChanged(user: FirebaseAuthTypes.User) {
    if (user) {
      await chatService.init();
      setChats(chatService.conversations);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        refetchChats,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}
