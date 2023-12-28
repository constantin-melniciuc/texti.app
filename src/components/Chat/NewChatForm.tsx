import React, { useCallback, useState } from "react";
import { Button, Icon, ListItem, Overlay, Header } from "@rneui/themed";
import Text from "../Shared/Text";
import styled from "styled-components/native";
import { colors, theme, zLayer } from "../../theme";
import { StyleSheet, View, ScrollView } from "react-native";
import { KeyboardView } from "../Shared/KeyboardView";
import PageTitle from "../Shared/PageTitle";
import { Category } from "../../services/ChatService";
import { UpsellPopup } from "./UpsellPopup";

const StyledInput = styled.TextInput`
  border: 1px solid ${colors.grayBorder};
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.spacing.sm}px;
  align-items: flex-start;
  margin-vertical: ${theme.spacing.md}px;
  flex: 1;
`;

const InputWithButtons = styled.View`
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm}px;
  flex-direction: row;
  gap: ${theme.spacing.md}px;
`;

const Container = styled.View<{ $withoutPadding?: boolean }>`
  padding: ${({ $withoutPadding }) =>
    $withoutPadding ? 0 : `${theme.spacing.md}px`};
  background-color: ${colors.white};
  flex: 1;
  flex-direction: column;
`;

type NewChatFormProps = {
  hasError: boolean;
  categories: Category;
  onSubmit: ({ topic, message }: { topic?: string; message?: string }) => void;
};

const NewChatForm = ({ onSubmit, categories, hasError }: NewChatFormProps) => {
  const [topic, setTopic] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSubmit = useCallback(() => {
    onSubmit({ topic, message: "" });
  }, [topic]);

  return (
    <KeyboardView>
      <Container>
        <View style={{ flex: 1 }}>
          <Text
            h4
            h4Style={{ fontWeight: "100", marginBottom: theme.spacing.md }}
          >
            Before we start, let&apos;s define a topic for our conversation
          </Text>

          <Text h4 h4Style={styles.helpText}>
            Consider adding very specific keywords that would help the AI,
            narrow the result, and add very specific information.
          </Text>
          <Text h4 h4Style={styles.helpText}>
            Example: content writing, thesaurus, grammar, punctuation, etc. But
            also you can include the emotions you want to convey, like sad,
            happy, polite, etc.
          </Text>
          <InputWithButtons>
            <StyledInput
              placeholder="Topic"
              value={topic}
              onChangeText={setTopic}
              multiline
            />
            <Icon
              name="add-circle"
              color={colors.accentBlue}
              onPress={() => setIsOpen(true)}
            />
          </InputWithButtons>
          {hasError ? (
            <View style={{ alignItems: "center" }}>
              <Text h4 h4Style={{ fontWeight: "100" }} color="red">
                Oh snap, something went wrong.
              </Text>
              <Text
                h4
                h4Style={{ fontWeight: "100", marginBottom: theme.spacing.md }}
                color="red"
              >
                Please try again.
              </Text>
            </View>
          ) : null}
        </View>
        <View>
          <Button
            title="Submit"
            size="sm"
            onPress={handleSubmit}
            disabled={topic.length === 0}
          />
          <Button
            title="Skip, I don't want to define a topic"
            size="sm"
            type="clear"
            onPress={handleSubmit}
            containerStyle={{ marginTop: theme.spacing.md }}
          />
        </View>
      </Container>
      <Overlay isVisible={isOpen} overlayStyle={{ zIndex: zLayer.modal - 1 }}>
        <Container $withoutPadding>
          <Header
            centerComponent={<PageTitle title="Browse topics" />}
            leftComponent={
              <Icon
                size={32}
                name="chevron-left"
                onPress={() => {
                  setIsOpen(false);
                }}
              />
            }
          />
          <ScrollView style={{ flex: 1 }}>
            {Object.entries(categories).map(([category, subCategories]) => (
              <ListItem
                key={category}
                onPress={() => setSelectedCategory(category)}
              >
                <ListItem.Content>
                  <ListItem.Title style={{ textTransform: "capitalize" }}>
                    {category}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ScrollView>
        </Container>
      </Overlay>
      <Overlay
        isVisible={!!selectedCategory}
        overlayStyle={{ zIndex: zLayer.modal }}
      >
        <Container $withoutPadding>
          <Header
            centerComponent={<PageTitle title={selectedCategory} />}
            leftComponent={
              <Icon
                size={32}
                name="chevron-left"
                onPress={() => {
                  setSelectedCategory("");
                }}
              />
            }
          />
          <ScrollView style={{ flex: 1 }}>
            {selectedCategory &&
              Object.entries(categories[selectedCategory]).map(
                ([_, prompt]) => (
                  <ListItem
                    key={prompt.title}
                    onPress={() => {
                      setTopic(prompt.prompt);
                      setSelectedCategory("");
                      setIsOpen(false);
                    }}
                  >
                    <ListItem.Content>
                      <ListItem.Title>{prompt.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                )
              )}
          </ScrollView>
        </Container>
      </Overlay>
      <UpsellPopup />
    </KeyboardView>
  );
};

export default NewChatForm;

const styles = StyleSheet.create({
  helpText: {
    fontSize: 12,
    fontWeight: "100",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
