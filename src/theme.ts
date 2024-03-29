import { createTheme } from "@rneui/themed";

const Z_MAX = 999999999;

const zLayer = {
  toasts: Z_MAX,
  modal: Z_MAX - 1,
};

const colors = {
  grayMessage: "#f4f4f4",
  grayBorder: "#ebedef",
  grayPlaceholder: "#a4a4a4",
  grayText: "#a1a0a0",
  errorRed: "#e23636",
  backgroundRed: "#eb7870",
  textRed: "#eb7870",
  hoverGreen: "#34c56e",
  backgroundGreen: "#80dbc4",
  contentBlack: "#1d2734",
  accentBlue: "#1c76fd",
  messageBlue: "#EAF2FF",
  white: "#ffffff",
  transparent: "rgba(0,0,0,0)",
};

const theme = createTheme({
  lightColors: {
    primary: colors.accentBlue,
    error: colors.errorRed,
    divider: colors.grayBorder,
    black: colors.contentBlack,
    background: colors.white,
    success: colors.hoverGreen,
    white: colors.white,
    greyOutline: colors.grayBorder,
  },
  darkColors: {
    primary: colors.contentBlack,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  mode: "light",
  components: {
    Header: {
      backgroundColor: colors.white,
      containerStyle: {
        borderBottomColor: colors.grayBorder,
        borderBottomWidth: 1,
      },
    },
    Button: (props, theme) => {
      let buttonStyle = {
        borderRadius: theme.spacing.sm,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
      };

      if (props.size === "sm") {
        buttonStyle = {
          borderRadius: theme.spacing.sm,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.sm,
        };
      }
      if (props.size === "lg") {
        buttonStyle = {
          borderRadius: theme.spacing.sm,
          paddingVertical: theme.spacing.xl,
          paddingHorizontal: theme.spacing.xl,
        };
      }

      return {
        buttonStyle,
      };
    },
    Text: {
      h1Style: {
        fontSize: 32,
      },
      h2Style: {
        fontSize: 26,
      },
      h3Style: {
        fontSize: 22,
      },
      h4Style: {
        fontSize: 18,
      },
      style: {
        fontSize: 16,
      },
    },
    Badge: {
      badgeStyle: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        height: 28,
      },
      textStyle: {
        textTransform: "uppercase",
      },
    },
    ListItem: {
      containerStyle: {
        borderBottomWidth: 2,
      },
    },
    Input: {
      inputContainerStyle: {
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
      },
      inputStyle: {
        fontSize: 14,
      },
    },
  },
});

export { colors, theme, zLayer };
