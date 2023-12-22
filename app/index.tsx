import { Stack, Link } from "expo-router";
import styled from "styled-components/native";
import { colors, theme } from "../src/theme";
import Text from "../src/components/Shared/Text";
import subscriptionServiceInstance, {
  SubscriptionService,
} from "../src/services/SubscriptionService";
import { Divider, Icon } from "@rneui/themed";
import userServiceInstance, { UserService } from "../src/services/UserService";
import { observer } from "mobx-react";

const StyledContainer = styled.View`
  flex: 1;
  align-items: center;
  padding: 24px;
`;

const StyledMain = styled.ScrollView`
  flex: 1;
  max-width: 960px;
  margin-horizontal: auto;
`;

const Row = styled.View`
  margin-vertical: ${theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.sm}px;
  flex-wrap: wrap;
`;

const Content = styled.View`
  margin-top: ${theme.spacing.lg * 4}px;
`;

const HomePage = observer(
  ({
    subscriptionService,
    userService,
  }: {
    subscriptionService: SubscriptionService;
    userService: UserService;
  }) => {
    const { user, backendUser } = userService;
    const { currentSubscription } = subscriptionService;

    return (
      <StyledContainer>
        <Stack.Screen
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <StyledMain
          contentContainerStyle={{ justifyContent: "center", flex: 1 }}
        >
          <Row>
            <Text h1 h1Style={{ textAlign: "center" }}>
              Welcome Back
            </Text>
            <Text h1 color="primary">
              {user?.displayName}
            </Text>
          </Row>
          {currentSubscription && backendUser ? (
            <Content>
              <Text h4 h4Style={{ fontWeight: "700" }}>
                We though you'd like to know some stats
              </Text>

              <Row>
                <Text>Max Monthly Questions:</Text>
                <Text weight="700">
                  {backendUser?.monthlyPhraseCount}/
                  {currentSubscription.metadata.request_count}
                </Text>
              </Row>
              <Row>
                <Text>Max Monthly Chats:</Text>
                <Text weight="700">
                  {backendUser?.monthlyChatCount}/
                  {currentSubscription.metadata.chat_count}
                </Text>
              </Row>
              <Divider style={{ marginBottom: theme.spacing.lg * 2 }} />
              <Row>
                <Text>View more in your</Text>
                <Link href="/dashboard">
                  <Row
                    style={{
                      marginVertical: 0,
                      borderBottomColor: colors.accentBlue,
                      borderBottomWidth: 1,
                      borderStyle: "solid",
                    }}
                  >
                    <Text color="primary">Profile</Text>
                    <Icon
                      type="font-awesome-5"
                      name="user-circle"
                      size={16}
                      color={colors.accentBlue}
                    />
                  </Row>
                </Link>
              </Row>
            </Content>
          ) : null}
        </StyledMain>
      </StyledContainer>
    );
  }
);

export default function HomePageWrapper() {
  return (
    <HomePage
      subscriptionService={subscriptionServiceInstance}
      userService={userServiceInstance}
    />
  );
}
