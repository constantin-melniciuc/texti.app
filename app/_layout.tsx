import { Stack } from "expo-router/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/contexts/auth";
import Header from "../src/components/Shared/Header";
import { ThemeProvider } from "@rneui/themed";
import { theme } from "../src/theme";
import { ChatProvider } from "../src/contexts/chat";
import Toast from "../src/components/Shared/Toast";
import { BottomNavigation } from "../src/components/Shared/BottomNavigation";

export default function Layout() {
  const commonHeaderOptions = {
    header: (props) => <Header {...props} />,
  };
  return (
    <AuthProvider>
      <ChatProvider>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  ...commonHeaderOptions,
                  title: "Home",
                }}
              />
              <Stack.Screen
                name="chats/[threadid]"
                options={{
                  ...commonHeaderOptions,
                }}
              />
              <Stack.Screen
                name="chats/new"
                options={{
                  ...commonHeaderOptions,
                  title: "New Chat",
                }}
              />
              <Stack.Screen
                name="chats/index"
                options={{
                  ...commonHeaderOptions,
                  title: "Chats",
                }}
              />

              <Stack.Screen
                name="dashboard"
                options={{
                  ...commonHeaderOptions,
                }}
              />
              <Stack.Screen name="(auth)/sign-in" />
            </Stack>
            <Toast />
            <BottomNavigation />
          </SafeAreaProvider>
        </ThemeProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
