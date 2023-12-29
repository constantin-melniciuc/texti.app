import { useEffect, useContext, createContext, useState } from "react";
import chatServiceInstance, {
  ChatService,
  IChatListItem,
} from "../services/ChatService";

const ChatContext = createContext<{
  chats: IChatListItem[];
  refetchChats: () => Promise<void>;
}>(null);

export function useChat() {
  return useContext(ChatContext);
}

type Props = {
  children: React.ReactNode;
  service: ChatService;
};

const _ChatProvider = ({ service, children }: Props) => {
  const [chats, setChats] = useState<IChatListItem[]>([]);

  async function refetchChats() {
    await service.fetchConversations();
    setChats(service.conversations);
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
      {children}
    </ChatContext.Provider>
  );
};

export function ChatProvider(props: Omit<Props, "service">) {
  return <_ChatProvider {...props} service={chatServiceInstance} />;
}
