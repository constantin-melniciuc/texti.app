import { Button } from "@rneui/themed";
import { useRouter, useSearchParams } from "expo-router";
import { View } from "react-native";
import Text from "../../src/components/Shared/Text";
import { colors, theme } from "../../src/theme";
import { Messages } from "../../src/components/Chat/Messages";
import { MessageForm } from "../../src/components/Chat/MessageForm";
import { UpsellPopup } from "../../src/components/Chat/UpsellPopup";

export default function Page() {
  const { threadid } = useSearchParams<{ threadid: string }>();
  const router = useRouter();

  const onCreateNew = () => {
    router.push("/chats/new");
  };

  if (threadid === "new") {
    return onCreateNew();
  }

  if (!threadid) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: theme.spacing.lg,
        }}
      >
        <Text weight="700">Invalid New Conversation ID</Text>
        <Text>It seems something went wrong.</Text>
        <Button title="Try Again" onPress={onCreateNew} />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white,
      }}
    >
      <Messages />
      <MessageForm />
      <UpsellPopup />
    </View>
  );
}
