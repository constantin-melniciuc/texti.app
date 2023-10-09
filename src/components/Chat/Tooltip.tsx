import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import Text from "../Shared/Text";
import { theme } from "../../theme";
import { Animated, View } from "react-native";
import { StyleSheet } from "react-native";

const Container = styled.View`
  position: absolute;
  background-color: #000;
  padding: 8px;
  padding-horizontal: ${theme.spacing.md}px;
  margin-top: ${theme.spacing.sm}px;
  left: 0;
  top: 0;
  border-radius: ${theme.spacing.sm}px;
  z-index: 2;
`;

const TooltipText = styled(Text)``;

const Tooltip = ({
  children,
  toggle = false,
}: {
  children: React.ReactNode;
  toggle?: boolean;
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const animatedController = useRef(new Animated.Value(0)).current;
  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size.height],
  });

  if (toggle) {
    Animated.timing(animatedController, {
      duration: 100,
      toValue: 1,
      useNativeDriver: false,
    }).start();
  } else {
    Animated.timing(animatedController, {
      duration: 100,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }

  return (
    <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
      <View
        onLayout={(e) =>
          setSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }
        style={styles.bodyContainer}
      >
        {children}
      </View>
    </Animated.View>
  );
};

export default Tooltip;

const styles = StyleSheet.create({
  bodyBackground: {
    overflow: "hidden",
    // backgroundColor: "#000",
  },
  bodyContainer: {
    position: "absolute",
    // backgroundColor: "#000",
    bottom: 0,
  },
});
