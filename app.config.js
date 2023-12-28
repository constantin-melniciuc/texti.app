module.exports = {
  expo: {
    scheme: "Texti",
    name: "Texti",
    slug: "textiapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.muzedigital.texti",
      supportsTablet: true,
      googleServicesFile: "./config/GoogleService-Info.plist",
    },
    android: {
      package: "com.muzedigital.texti",
      googleServicesFile: "./config/google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    extra: {
      eas: {
        projectId: "5110530d-c44c-4169-85d2-5200aee2d8f3",
      },
    },
    owner: "textiapp",
  },
  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/perf",
    "@react-native-firebase/crashlytics",
    "@react-native-google-signin/google-signin",
    "expo-build-properties",
    {
      ios: {
        useFrameworks: "static",
      },
    },
  ],
};
