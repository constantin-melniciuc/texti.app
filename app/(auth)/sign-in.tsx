import { View } from "react-native";
import { useAuth } from "../../src/contexts/auth";
import { Button, Icon, Image } from "@rneui/themed";
import { theme } from "../../src/theme";
import Text from "../../src/components/Shared/Text";
import { Stack, Tabs } from "expo-router";

export default function SignIn() {
  const { signInWithGoogle } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.lightColors.white,
      }}
    >
      <Stack.Screen
        options={{
          header: () => null,
        }}
      />

      <Tabs.Screen
        options={{
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <View style={{ gap: theme.spacing.md, alignItems: "center" }}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 120, height: 120, borderRadius: 60 }}
        />
        <Text h1>Welcome to Texti</Text>
      </View>
      <View style={{ marginTop: theme.spacing.lg * 4 }}>
        <Button type="solid" onPress={() => signInWithGoogle()}>
          Login with{" "}
          <Icon
            type="antdesign"
            name="google"
            color={theme.lightColors.white}
          />
        </Button>
      </View>
    </View>
  );
}
