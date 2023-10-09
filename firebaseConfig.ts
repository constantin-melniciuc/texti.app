import { Platform } from "react-native";
import firebase from "@react-native-firebase/app";

import {
  IOS_APP_ID,
  ANDROID_APP_ID,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  API_KEY,
} from "@env";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  appId: Platform.OS === "ios" ? IOS_APP_ID : ANDROID_APP_ID,
};

firebase.initializeApp(firebaseConfig);
