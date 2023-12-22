import { Header as RNHeader, Icon } from "@rneui/themed";
import Avatar from "./Avatar";
import PageTitle from "./PageTitle";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useAuth } from "../../contexts/auth";
import { useNavigation } from "expo-router";
import { StackActions } from "@react-navigation/native";

export default function Header(props: NativeStackHeaderProps) {
  const routeName = props.route.name;
  const { user } = useAuth();
  const navigation = useNavigation();

  const handlePopToTop = () => {
    navigation.dispatch(StackActions.popToTop());
  };

  const navigateToChatList = () => {
    navigation.dispatch(StackActions.pop());
  };

  if (routeName.includes("sign-in") || routeName.includes("sign-up") || !user)
    return null;
  const navigateBack = () => {
    if (routeName === "index") return;
    if (
      routeName.includes("chats/[threadid]") ||
      routeName.includes("chats/new")
    ) {
      return navigateToChatList();
    }
    return handlePopToTop();
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
