import { Platform } from "react-native";
import firebase from "@react-native-firebase/app";

import {
  IOS_APP_ID,
  IOS_ENCODED_APP_ID,
  ANDROID_APP_ID,
  BUNDLE_ID,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  API_KEY,
  // MESSAGING_SENDER_ID,
  // MEASUREMENT_ID,
  // @ts-ignore - types are not available for this package
} from "@env";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  // databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  // messagingSenderId: MESSAGING_SENDER_ID,
  appId: Platform.OS === "ios" ? IOS_APP_ID : ANDROID_APP_ID,
  // measurementId: MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
