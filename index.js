import "expo-router/entry";
import * as Sentry from "@sentry/react-native";
import { ENV } from "@env";

Sentry.init({
  dsn: "https://375df6a0fb228d993c19e7debff8a904@o4504974714798080.ingest.sentry.io/4506473009709056",
  environment: ENV,
});
