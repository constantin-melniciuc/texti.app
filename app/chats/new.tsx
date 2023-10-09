import { useRouter } from "expo-router";
import chatService, { ChatService } from "../../src/services/ChatService";
import NewChatForm from "../../src/components/Chat/NewChatForm";
import { useState } from "react";

function New({ service }: { service: ChatService }) {
  const router = useRouter();
  const [hasError, setHasError] = useState<boolean>(false);

  const onCreateNew = async ({ topic, message }) => {
    const threadId = await service.createConversation({ topic, message });
    if (!threadId) {
      setHasError(true);
      return;
    }
    router.push(`/chats/${threadId}`);
  };

  return (
    <NewChatForm
      hasError={hasError}
      onSubmit={onCreateNew}
      categories={service.categories}
    />
  );
}

export default function Page() {
  return <New service={chatService} />;
}
