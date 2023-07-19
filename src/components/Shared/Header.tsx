import { Header as RNHeader, Icon } from "@rneui/themed";
import Avatar from "./Avatar";
import PageTitle from "./PageTitle";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useAuth } from "../../contexts/auth";

export default function Header(props: NativeStackHeaderProps) {
  const routeName = props.route.name;
  const { user } = useAuth();

  if (routeName === "sign-in" || routeName === "sign-up" || !user) return null;
  const navigateBack = () => {
    if (routeName === "index") return;
    if (routeName === "chats/[threadid]" || routeName === "chats/new") {
      return props.navigation.navigate("chats/index");
    }
    return props.navigation.goBack();
  };

  const title = props.options.title;
  const leftComponent =
    routeName === "index" ? null : (
      <Icon size={32} name="chevron-left" onPress={navigateBack} />
    );

  return (
    <RNHeader
      leftComponent={leftComponent}
      centerComponent={<PageTitle title={title} />}
      rightComponent={<Avatar size={32} />}
    />
  );
}
