import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  View,
} from "react-native";
import React from "react";

type KeyboardViewProps = KeyboardAvoidingViewProps & {
  children: React.ReactNode;
};

export const KeyboardView = ({
  children,
  style,
  behavior,
  ...rest
}: KeyboardViewProps) => {
  return (
    <KeyboardAvoidingView
      {...rest}
      style={[style, { flex: 1 }]}
      // on android for some use-cases (login form), behaviour must be set to padding,
      // otherwise the keyboard will cover the input fields, for the rest undefined is fine
      behavior={Platform.OS === "ios" ? "padding" : behavior}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </KeyboardAvoidingView>
  );
};
