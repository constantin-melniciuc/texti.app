import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, Icon, Overlay } from "@rneui/themed";
import { useAuth } from "../src/contexts/auth";
import { colors, theme } from "../src/theme";
import Text from "../src/components/Shared/Text";
import subscriptionService from "../src/services/SubscriptionService";
import { WebView } from "react-native-webview";
import { useEffect, useState } from "react";
import userService from "../src/services/UserService";
import styled from "styled-components/native";

const StyledCloseButton = styled(Icon)`
  z-index: 1;
`;

const StyledTopBar = styled.View`
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const Feature = ({ isActive }: { isActive: boolean }) => {
  return isActive ? (
    <View style={styles.inline}>
      <Text>Yes</Text>
      <Icon
        type="antdesign"
        name="checkcircleo"
        color={colors.hoverGreen}
        size={16}
      />
    </View>
  ) : (
    <View style={styles.inline}>
      <Text>No</Text>
      <Icon
        size={16}
        type="antdesign"
        name="minuscircleo"
        color={colors.textRed}
      />
    </View>
  );
};

export default function Dashboard() {
  const [visible, setVisible] = useState(false);
  const [source, setSource] = useState("");
  const { user, backendUser } = useAuth();
  const { currentSubscription } = subscriptionService;

  useEffect(() => {
    const getCheckoutUrl = async () => {
      const checkoutUrl = await userService.createWebUrl();
      if (checkoutUrl) {
        setSource(checkoutUrl);
      }
    };
    getCheckoutUrl();
  }, [visible]);

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        justifyContent: "flex-start",
        alignItems: "stretch",
        padding: 24,
      }}
    >
      <Stack.Screen
        options={{
          title: "Dashboard",
        }}
      />

      <Text h3>👋 {user?.displayName}</Text>
      <View
        style={{ paddingLeft: theme.spacing.md, marginTop: theme.spacing.md }}
      >
        <Text style={{}}>Welcome to your Dashboard</Text>
        <Text style={{}}>Here you can manage your account.</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.row}>
          <Text weight="700" h3>
            Your bio
          </Text>
        </View>
        <View style={styles.row}>
          <Text weight="700">E-mail:</Text>
          <Text>{user?.email}</Text>
        </View>
        <Divider style={{ marginBottom: theme.spacing.lg }} />
        <View style={styles.row}>
          <Text weight="700" h3>
            Your subscription
          </Text>
        </View>
        <View style={styles.row}>
          <Text weight="700">Tier:</Text>
          <Text>
            {backendUser?.subscription.name.charAt(0).toUpperCase() +
              backendUser?.subscription.name.slice(1)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text weight="700">Paid Subscription?</Text>
          <Feature isActive={backendUser?.subscription.status === "paid"} />
        </View>
        {currentSubscription ? (
          <>
            <View style={styles.row}>
              <Text weight="700">Max Monthly Questions:</Text>
              <Text>
                {backendUser?.monthlyPhraseCount}/
                {currentSubscription.metadata.request_count}
              </Text>
            </View>
            <View style={styles.row}>
              <Text weight="700">Max Monthly Chats:</Text>
              <Text>
                {backendUser?.monthlyChatCount}/
                {currentSubscription.metadata.chat_count}
              </Text>
            </View>
            <View style={styles.row}>
              <Text weight="700">Are your Questions Private?</Text>
              <Feature
                isActive={currentSubscription.metadata.private_requests === "1"}
              />
            </View>
            <View style={styles.row}>
              <Text weight="700">Can you search the web?</Text>
              <Feature
                isActive={currentSubscription.metadata.web_browsing === "1"}
              />
            </View>
          </>
        ) : null}
        <View>
          <Button
            title="Upgrade Plan"
            loading={!source}
            onPress={() => setVisible(true)}
          />
        </View>
      </View>
      <Overlay
        isVisible={visible}
        style={{ flex: 1, width: "100%", position: "relative" }}
        onDismiss={() => setVisible(false)}
        fullScreen
        onRequestClose={() => setVisible(false)}
        supportedOrientations={["portrait", "portrait-upside-down"]}
      >
        <StyledTopBar>
          <Text h3>Upgrade Plan</Text>
          <StyledCloseButton
            raised
            name="close"
            onPress={() => setVisible(false)}
          />
        </StyledTopBar>
        {source ? (
          <WebView source={{ uri: source }} style={{ flex: 1 }} />
        ) : null}
      </Overlay>
      <View style={styles.container}>
        <Text weight="700" h3>
          Already saying bye? 😢
        </Text>
        <Button
          containerStyle={{ marginTop: theme.spacing.xl }}
          color={theme.darkColors.error}
          title="Logout"
          onPress={() => userService.signOut()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.spacing.sm,
    backgroundColor: colors.white,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    elevation: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  row: {
    marginVertical: theme.spacing.xs,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    flexWrap: "nowrap",
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
});
