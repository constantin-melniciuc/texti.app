import { useRouter } from "expo-router";
import chatService from "../../src/services/ChatService";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  const onCreateNew = async () => {
    const threadId = await chatService.createConversation();
    console.log(">> new conversation page threadID", threadId);
    router.push(`/chats/${threadId}`);
    // router.push("/chats/1234");
  };

  useEffect(() => {
    onCreateNew();
  }, []);

  return null;
}
