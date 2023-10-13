import { Overlay, Chip } from "@rneui/themed";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, theme, zLayer } from "../../theme";
import toastService, { ToastService } from "../../services/ToastService";
import React from "react";
import { observer } from "mobx-react";

class CustomView extends React.Component<{
  visible: boolean;
  style: ViewStyle;
  children: React.ReactNode;
}> {
  render() {
    const { visible, style, children, ...rest } = this.props;
    return (
      <View
        {...rest}
        style={StyleSheet.flatten([
          style,
          { display: visible ? "flex" : "none" },
        ])}
      >
        {children}
      </View>
    );
  }
}

export const Toast = observer(({ service }: { service: ToastService }) => {
  const chipStyle =
    service.type === "success" ? styles.chipSuccess : styles.chipError;
  return (
    <Overlay
      isVisible={service.isVisible}
      style={styles.overlayContainer}
      backdropStyle={styles.backdrop}
      overlayStyle={styles.overlayStyle}
      ModalComponent={CustomView}
    >
      <Chip
        title={service.message}
        type="solid"
        buttonStyle={chipStyle}
        size="md"
        titleStyle={{
          color: colors.white,
        }}
        iconRight
        icon={{
          name: "closecircle",
          type: "antdesign",
          size: 16,
          color: colors.white,
        }}
        iconContainerStyle={{ paddingLeft: theme.spacing.sm }}
        onPress={() => {
          service.hide();
        }}
      />
    </Overlay>
  );
});

export default function ToastWrapper() {
  return <Toast service={toastService} />;
}

const styles = StyleSheet.create({
  overlayContainer: {
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    padding: 0,
    zIndex: zLayer.toasts,
  },
  backdrop: {
    backgroundColor: colors.transparent,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    padding: 0,
  },
  overlayStyle: {
    backgroundColor: colors.transparent,
    shadowColor: "transparent",
  },
  chipSuccess: {
    backgroundColor: colors.backgroundGreen,
  },
  chipError: {
    backgroundColor: colors.backgroundRed,
  },
});
