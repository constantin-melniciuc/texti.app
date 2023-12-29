import { Avatar as RNAvatar } from "@rneui/themed";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { colors } from "../../theme";
import userServiceInstance, { UserService } from "../../services/UserService";
import { observer } from "mobx-react";

type AvatarProps = {
  service: UserService;
  size?: number;
};

const Avatar = observer(({ size = 64, service }: AvatarProps) => {
  const { user } = service;
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
});

export default function AvatarWrapper(props: Omit<AvatarProps, "service">) {
  return <Avatar {...props} service={userServiceInstance} />;
}
