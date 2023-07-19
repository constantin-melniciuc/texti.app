import { Text, View } from "react-native";
import { useAuth } from "../../src/contexts/auth";

export default function SignIn() {
  const { signInWithGoogle } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={() => signInWithGoogle()}>Sign In with Google</Text>
    </View>
  );
}
