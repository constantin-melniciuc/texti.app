import { Avatar as RNAvatar } from "@rneui/themed";
import { useAuth } from "../../contexts/auth";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { colors } from "../../theme";

export default function Avatar({ size = 64 }) {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  const titleOrAvatar = user.photoURL
    ? {
        source: { uri: user.photoURL },
      }
    : {
        title: user.displayName?.substring(0, 2) || "AI",
      };
  return (
    <TouchableOpacity>
      <Link replace href="/dashboard">
        <RNAvatar
          size={size}
          {...titleOrAvatar}
          rounded
          containerStyle={{ backgroundColor: colors.contentBlack }}
          avatarStyle={{
            borderColor: colors.grayPlaceholder,
          }}
          titleStyle={{
            color: colors.white,
            fontSize: 14,
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        />
      </Link>
    </TouchableOpacity>
  );
}
