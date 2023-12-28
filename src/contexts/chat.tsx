import { useEffect, useContext, createContext, useState } from "react";
import chatService, { IChatListItem } from "../services/ChatService";

const ChatContext = createContext<{
  chats: IChatListItem[];
  refetchChats: () => Promise<void>;
}>(null);

export function useChat() {
  return useContext(ChatContext);
}

type Props = {
  children: React.ReactNode;
};

export function ChatProvider(props: Props) {
  const [chats, setChats] = useState<IChatListItem[]>([]);

  async function refetchChats() {
    await chatService.fetchConversations();
    setChats(chatService.conversations);
  }

  useEffect(() => {
    refetchChats();
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
