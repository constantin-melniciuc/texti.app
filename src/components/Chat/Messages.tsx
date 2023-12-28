import React, { useEffect, useRef } from "react";
import chatService, { ChatService } from "../../services/ChatService";
import { colors, theme } from "../../theme";
import styled from "styled-components/native";
import { observer } from "mobx-react";
import { IconButton } from "../Shared/IconButton";
import { Keyboard, ScrollView } from "react-native";
import { Message, MessagesContainer, StyledMarkdown } from "./StyledComponents";

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
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef?.current.scrollToEnd({ animated: true });
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      scrollViewRef?.current.scrollToEnd({ animated: true });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const { streamingMessage, activeChat, stopReason } = service;
  const scrollViewRef = useRef<ScrollView | null>(null);

  return (
    <MessagesContainer
      ref={scrollViewRef}
      automaticallyAdjustKeyboardInsets
      onContentSizeChange={() => {
        if (!scrollViewRef?.current) return;
        scrollViewRef.current.scrollToEnd({ animated: true });
      }}
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
          <StyledMarkdown>{activeChat?.topic}</StyledMarkdown>
        </Message>
      ) : null}
      {activeChat?.messages?.map((message) => {
        return (
          <Message role={message.role} key={message.createdAt}>
            <StyledMarkdown>{message.content}</StyledMarkdown>
          </Message>
        );
      })}
      {streamingMessage ? (
        <Message role="assistant">
          <StyledMarkdown>{streamingMessage}</StyledMarkdown>
        </Message>
      ) : null}
      {stopReason === "length" ? (
        <ButtonsContainer>
          <Message role="assistant">
            <StyledMarkdown>Continue?</StyledMarkdown>
          </Message>
          <StyledIconButton
            name="done"
            color={colors.hoverGreen}
            onPress={() => service.continueStream()}
          />
          <StyledIconButton
            name="close"
            color={colors.errorRed}
            onPress={() => service.endStream()}
          />
        </ButtonsContainer>
      ) : null}
    </MessagesContainer>
  );
});

export const Messages = () => {
  return <MessagesView service={chatService} />;
};
