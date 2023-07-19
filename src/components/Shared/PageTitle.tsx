import { Text } from "@rneui/themed";
import { APP_NAME } from "@env";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function PageTitle({ title }: { title?: string }) {
  return (
    <TouchableOpacity>
      <Link href="/">
        <Text h4>{title || APP_NAME}</Text>
      </Link>
    </TouchableOpacity>
  );
}
