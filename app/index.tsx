import { StyleSheet, View } from "react-native";
import { Text, Button } from "@rneui/themed";
import { useAuth } from "../src/contexts/auth";
import { Stack } from "expo-router";
import { useSubscription } from "../src/contexts/subscription";

export default function HomePage() {
  const { user } = useAuth();
  const { refetchInfo } = useSubscription();
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />
      <View style={styles.main}>
        <Text h1>Welcome Back {user?.displayName}</Text>
        <Button title="Refetch info" onPress={refetchInfo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
});
