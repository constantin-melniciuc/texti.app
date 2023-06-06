import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import userService from "../src/services/UserService";

export default function Page() {
  const loginWithGoogle = () => {
    console.log("Login with Google");
    userService.signInWithGoogle();
  };
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Login to start chatting</Text>
        <TouchableOpacity onPress={loginWithGoogle}>
          <Text style={styles.subtitle}>Login with Google</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
