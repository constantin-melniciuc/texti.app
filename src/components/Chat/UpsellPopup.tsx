import { observer } from "mobx-react";
import chatService, { ChatService } from "../../services/ChatService";
import { Button, Overlay } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import RobotAvatar from "../Shared/RobotAvatar";
import Text from "../Shared/Text";
import { colors, theme, zLayer } from "../../theme";
import { useRouter } from "expo-router";

const useUpsellPopup = ({ service }: { service: ChatService }) => {
  const router = useRouter();
  const onOpenChat = () => {
    service.setActiveThreadId("new");

    router.push(`/chats/new`);
  };

  switch (service.upsellReason) {
    case "monthly_limit_reached":
      return {
        text: "You have reached the limit of available chats.",
        button: "View Plan Details",
        action: () => router.push("/dashboard"),
      };
    case "max_messages_reached":
      return {
        text: "You have reached the limit of messages in a conversation.",
        button: "Start New Chat",
        action: onOpenChat,
      };
    default:
      return {
        text: "",
        button: "",
        action: () => {},
      };
  }
};

const UpsellPopupView = observer(({ service }: { service: ChatService }) => {
  const { action, button, text } = useUpsellPopup({ service });

  return (
    <Overlay
      overlayStyle={{ zIndex: zLayer.modal }}
      isVisible={!!service.upsellReason}
      fullScreen
    >
      <View style={styles.container}>
        <RobotAvatar index={10} size={128} />
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text h2 h2Style={{ textAlign: "center" }}>
            {text}
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <Button color="success" title={button} onPress={action} />
          <Button color="error" title="Close" onPress={service.dismissUpsell} />
        </View>
      </View>
    </Overlay>
  );
});

export const UpsellPopup = () => {
  return <UpsellPopupView service={chatService} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: theme.spacing.lg,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
});
