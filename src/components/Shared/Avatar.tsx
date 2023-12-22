import { Avatar as RNAvatar } from "@rneui/themed";
import { useAuth } from "../../contexts/auth";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function Avatar({ size = 64 }) {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  return (
    <TouchableOpacity>
      <Link replace href="/dashboard">
        <RNAvatar
          size={size}
          title={user?.displayName}
          source={{ uri: user.photoURL }}
          rounded
        />
      </Link>
    </TouchableOpacity>
  );
}
