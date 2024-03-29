import { Text as RNText, TextProps as RNTextProps } from "@rneui/themed";
import { colors } from "../../theme";

type TextProps = RNTextProps & {
  color?: "black" | "white" | "gray" | "red" | "primary";
  weight?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800";
};

const computeColor = (color: TextProps["color"]) => {
  switch (color) {
    case "white":
      return colors.white;
    case "gray":
      return colors.grayText;
    case "red":
      return colors.errorRed;
    case "primary":
      return colors.accentBlue;
    default:
      return colors.contentBlack;
  }
};

export default function Text(props: TextProps) {
  const color = computeColor(props.color);
  return (
    <RNText {...props} style={{ color, fontWeight: props.weight || "400" }} />
  );
}
