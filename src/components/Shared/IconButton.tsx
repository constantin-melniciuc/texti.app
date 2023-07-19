import { Icon, IconProps } from "@rneui/themed";
import styled from "styled-components/native";
import { colors, theme } from "../../theme";

const StyledIconButton = styled(Icon)`
  background-color: ${colors.messageBlue};
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.spacing.sm}px;
`;

export const IconButton = (props: IconProps) => {
  return <StyledIconButton {...props} />;
};
