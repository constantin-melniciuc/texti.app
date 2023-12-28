import React, { useState } from "react";
import { Button, Input } from "@rneui/themed";
import styled from "styled-components/native";
import { colors, theme } from "../../theme";
import chatService, { ChatService } from "../../services/ChatService";
import { observer } from "mobx-react";

const MessageFormContainer = styled.View`
  flex-direction: row;
  padding: ${theme.spacing.md}px;
`;

const MessageFormView = observer(({ service }: { service: ChatService }) => {
  const [message, setMessage] = useState<string>("");

  const onSubmit = () => {
    service.sendMessage(message);
    setMessage("");
  };
  return (
    <MessageFormContainer>
      <Input
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
        containerStyle={{ flex: 1 }}
        errorStyle={{ display: "none" }}
      />
      <Button
        buttonStyle={{
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        onPress={onSubmit}
        disabled={!message}
        icon={{
          name: "send",
          color: colors.white,
          size: 24,
        }}
        iconRight
      />
    </MessageFormContainer>
  );
});

export const MessageForm = () => {
  return <MessageFormView service={chatService} />;
};
