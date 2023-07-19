import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Badge, Button } from "@rneui/themed";
import { useSubscription } from "../src/contexts/subscription";
import { useAuth } from "../src/contexts/auth";
import { colors, theme } from "../src/theme";
import Text from "../src/components/Shared/Text";
import { convertCentsToFixed } from "../src/services/utils";

export default function Profile() {
  const { user } = useAuth();
  const { subscription, plan } = useSubscription();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
        padding: 24,
      }}
    >
      <Stack.Screen
        options={{
          title: "Profile",
        }}
      />

      <Text h4>Hi {user?.displayName}!</Text>

      <View style={styles.container}>
        <View style={styles.row}>
          <Text weight="700" h4>
            Subscription Details
          </Text>
        </View>
        <View style={styles.row}>
          <Text weight="700" color="gray">
            Plan
          </Text>
          <Badge value={subscription?.name} status="primary" />
        </View>
        <View style={styles.row}>
          <Text weight="700" color="gray">
            Subscription recurrence
          </Text>
          <Text style={{ textTransform: "capitalize" }}>
            {subscription?.subscriptionType.charAt(0).toUpperCase() +
              subscription?.subscriptionType.slice(1)}
          </Text>
          <View style={styles.row}>
            <Text weight="700" color="gray">
              Plan Features
            </Text>
            <View style={{ ...styles.row, flexDirection: "row", margin: 0 }}>
              <Text>
                {plan.metadata.internal_name === "free"
                  ? "Free"
                  : `${convertCentsToFixed(plan.price.unit_amount_decimal)}/mo`}
              </Text>
              <Text weight="700" color="gray">
                ●
              </Text>
              <Text>{plan.metadata.chat_count} Chats</Text>
              <Text weight="700" color="gray">
                ●
              </Text>
              <Text>{plan.metadata.request_count} Requests</Text>
            </View>
          </View>
        </View>
        <View>
          {/* TODO: On click open webview where the user is authed into backend and he can upgrade his package token should be passed as an argument probably */}
          <Button title="Upgrade Plan" />
        </View>
      </View>
    </View>
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
    marginVertical: theme.spacing.sm,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    flexWrap: "wrap",
  },
});
