import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/contexts/auth";
import Header from "../src/components/Shared/Header";
import { ThemeProvider } from "@rneui/themed";
import { theme } from "../src/theme";
import { ChatProvider } from "../src/contexts/chat";
import { Icon } from "@rneui/themed";
import Toast from "../src/components/Shared/Toast";

const tabBarIcon = ({ size, color, focused, iconName }) => {
  // You can return any component that you like here!
  return <Icon name={iconName} size={size} color={color} />;
};

export default function Layout() {
  const commonHeaderOptions = {
    header: (props) => <Header {...props} />,
  };
  return (
    <AuthProvider>
      <ChatProvider>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <Tabs>
              <Tabs.Screen
                name="index"
                options={{
                  ...commonHeaderOptions,
                  title: "Home",
                  tabBarIcon: (props) =>
                    tabBarIcon({ ...props, iconName: "home" }),
                }}
              />
              <Tabs.Screen
                name="chats/[threadid]"
                options={{
                  ...commonHeaderOptions,
                  href: null,
                }}
              />
              <Tabs.Screen
                name="chats/new"
                options={{
                  ...commonHeaderOptions,
                  href: "/chats/new",
                  title: "New Chat",
                  tabBarIcon: (props) =>
                    tabBarIcon({ ...props, iconName: "add-circle" }),
                }}
              />
              <Tabs.Screen
                name="chats/index"
                options={{
                  ...commonHeaderOptions,
                  title: "Chats",
                  tabBarIcon: (props) =>
                    tabBarIcon({ ...props, iconName: "forum" }),
                }}
              />

              <Tabs.Screen
                name="dashboard"
                options={{
                  ...commonHeaderOptions,
                  href: null,
                }}
              />
              <Tabs.Screen name="(auth)/sign-in" options={{ href: null }} />
            </Tabs>
            <Toast />
          </SafeAreaProvider>
        </ThemeProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
