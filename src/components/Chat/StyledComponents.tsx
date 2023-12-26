import Text from "../Shared/Text";
import { colors, theme } from "../../theme";
import styled from "styled-components/native";
import { IMessage } from "../../services/ChatService";
import Markdown from "react-native-markdown-display";

export const MessagesContainer = styled.ScrollView`
  flex: 1;
  padding: ${theme.spacing.md}px;
  width: 100%;
  position: relative;
  height: 100%;
`;

export const Message = styled.View<{ role: IMessage["role"] }>`
  background-color: ${({ role }) =>
    role === "user" ? colors.grayMessage : colors.messageBlue};
  align-self: ${({ role }) => (role === "user" ? "flex-end" : "flex-start")};
  padding: ${theme.spacing.md}px;
  border-top-left-radius: ${theme.spacing.sm}px;
  border-top-right-radius: ${theme.spacing.sm}px;
  border-bottom-left-radius: ${({ role }) =>
    role === "user" ? theme.spacing.sm : 0}px;
  border-bottom-right-radius: ${({ role }) =>
    role === "user" ? 0 : theme.spacing.sm}px;
  margin-bottom: ${theme.spacing.md}px;
  margin-right: ${({ role }) => (role === "user" ? 0 : theme.spacing.xl)}px;
  margin-left: ${({ role }) => (role === "user" ? theme.spacing.xl : 0)}px;
`;

export const MessageText = styled(Text)``;

export const StyledMarkdown = ({ children }: { children: string }) => (
  <Markdown
    style={{
      body: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.contentBlack,
      },
    }}
  >
    {children}
  </Markdown>
);
