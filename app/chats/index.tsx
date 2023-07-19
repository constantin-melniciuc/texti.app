import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
// import { useChat } from "../../src/contexts/chat";
import { ListItem } from "@rneui/themed";
import { theme } from "../../src/theme";
import RobotAvatar from "../../src/components/Chat/RobotAvatar";
import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import chatService, {
  ChatService,
  IChatListItem,
} from "../../src/services/ChatService";
import { observer } from "mobx-react";

const ChatPage = observer(({ service }: { service: ChatService }) => {
  // const { chats, refetchChats } = useChat();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await service.fetchConversations();
    setRefreshing(false);
  }, []);

  const onOpenChat = (threadId: string) => {
    service.setActiveThreadId(threadId);

    router.push(`/chats/${threadId}`);
  };

  console.log("convs", service.conversations);

  const _renderItem = ({
    item,
    index,
  }: {
    item: IChatListItem;
    index: number;
  }) => {
    const formattedDate = new Date(item.date).toLocaleString();
    return (
      <TouchableOpacity onPress={() => onOpenChat(item.threadId)}>
        <ListItem>
          <RobotAvatar index={index} />
          <ListItem.Content style={{ gap: theme.spacing.lg }}>
            <ListItem.Title ellipsizeMode="tail" numberOfLines={2}>
              {item.messages?.[0]?.content || ""}
            </ListItem.Title>
            <ListItem.Subtitle ellipsizeMode="tail" numberOfLines={2}>
              {formattedDate}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color="black" size={24} />
        </ListItem>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => onOpenChat("new")}>
        <ListItem bottomDivider>
          <RobotAvatar icon="PlusSign" />
          <ListItem.Content style={{ gap: theme.spacing.lg }}>
            <ListItem.Title ellipsizeMode="tail" numberOfLines={2}>
              Create new chat
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color="black" size={24} />
        </ListItem>
      </TouchableOpacity>
      <FlatList
        data={service.conversations}
        keyExtractor={(item) => item.threadId}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={_renderItem}
      />
    </View>
  );
});

export default function ChatPageWrapper() {
  return <ChatPage service={chatService} />;
}
