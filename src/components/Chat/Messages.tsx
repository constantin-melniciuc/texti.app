import React from "react";
import chatService, { IMessage, ChatService } from "../../services/ChatService";
import Text from "../Shared/Text";
import { colors, theme } from "../../theme";
import styled from "styled-components/native";
// import { useChat } from "../../contexts/chat";
import { observer } from "mobx-react";
import { IconButton } from "../Shared/IconButton";

const MessagesContainer = styled.ScrollView`
  flex: 1;
  padding: ${theme.spacing.md}px;
  width: 100%;
`;

const Message = styled.View<{ role: IMessage["role"] }>`
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

const MessageText = styled(Text)`
  word-break: break-word;
  white-space: break-spaces;
`;

const ButtonsContainer = styled.View`
  flex-flow: row-nowrap;
  justify-content: flex-start;
  justify-items: flex-start;
  align-items: center;
  flex: 1;
  align-self: flex-start;
  gap: ${theme.spacing.sm}px;
`;

const StyledIconButton = styled(IconButton)`
  margin-bottom: ${theme.spacing.md}px;
`;

const MessagesView = observer(({ service }: { service: ChatService }) => {
  const { streamingMessage, activeChat, stopReason } = service;

  return (
    <MessagesContainer
      contentContainerStyle={{
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
    >
      {activeChat?.topic ? (
        <Message role="user">
          <MessageText weight="500">{activeChat?.topic}</MessageText>
        </Message>
      ) : null}
      {activeChat?.messages?.map((message) => {
        return (
          <Message role={message.role} key={message.createdAt}>
            <MessageText weight="500">{message.content}</MessageText>
          </Message>
        );
      })}
      {streamingMessage ? (
        <Message role="assistant">
          <MessageText weight="500">{streamingMessage}</MessageText>
        </Message>
      ) : null}
      {stopReason === "length" ? (
        <ButtonsContainer>
          <Message role="assistant">
            <MessageText weight="500">Continue?</MessageText>
          </Message>
          <StyledIconButton
            name="done"
            color={colors.hoverGreen}
            onPress={service.continueStream}
          />
          <StyledIconButton
            name="close"
            color={colors.errorRed}
            onPress={service.endStream}
          />
        </ButtonsContainer>
      ) : null}
    </MessagesContainer>
  );
});

export const Messages = () => {
  return <MessagesView service={chatService} />;
};
