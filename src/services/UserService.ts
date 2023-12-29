import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { API_URL, GOOGLE_CLIENT_ID, AUTH_JWT_SIGNATURE } from "@env";
import { SUBSCRIPTION_NAMES } from "./SubscriptionService";
import {
  action,
  flow,
  makeObservable,
  observable,
  runInAction,
  when,
} from "mobx";
import { buildHeaders } from "./utils";
import { sign } from "react-native-pure-jwt";
import {
  captureException,
  captureEvent,
  configureScope,
} from "@sentry/react-native";

GoogleSignin.configure({
  scopes: ["email", "name", "profile"],
});

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
});

export type BackendUser = {
  userId: string;
  email: string;
  monthlyChatCount: number;
  monthlyPhraseCount: number;
  subscription: {
    name: SUBSCRIPTION_NAMES;
    subscriptionType: string;
    status: "paid" | "unpaid";
  };
};

// for troubleshooting see
// https://github.com/react-native-google-signin/google-signin/blob/master/docs/android-guide.md#google-login-does-not-work-when-using-internal-app-sharing
export class UserService {
  accessToken: string | null = null;
  user: FirebaseAuthTypes.User | null = null;
  backendUser: BackendUser | null = null;
  isSigningIn = false;

  constructor() {
    makeObservable(this, {
      // observables
      accessToken: observable,
      backendUser: observable,
      isSigningIn: observable,
      user: observable,
      // actions
      getCurrentUser: action,
      setBackendUser: action,
      setUser: action,
      // generators
      getTokens: flow,
      signIn: flow,
      signInWithGoogle: flow,
      signOut: flow,
    });

    when(
      () => this.user !== null,
      async () => {
        await this.getMe();
      }
    );
  }

  setUser = async (user: FirebaseAuthTypes.User | null) => {
    runInAction(() => {
      this.user = user;
    });

    configureScope((scope) => {
      scope.setUser({
        id: user?.uid,
        email: user?.email,
      });
    });
  };

  setBackendUser = (backendUser: BackendUser | null) => {
    runInAction(() => {
      this.backendUser = backendUser;
    });
  };

  signIn = flow(function* (this: UserService) {
    if (this.isSigningIn) return null;
    yield GoogleSignin.signInSilently();
  });

  isSignedIn = flow(function* (this: UserService) {
    return yield GoogleSignin.isSignedIn();
  });

  signInWithGoogle = flow(function* (this: UserService) {
    this.isSigningIn = true;
    // Check if your device supports Google Play
    yield GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    try {
      const user = yield GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(
        user.idToken as string
      );

      // Sign-in the user with the credential
      const result: FirebaseAuthTypes.UserCredential =
        yield auth().signInWithCredential(googleCredential);

      return result;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        captureEvent({
          level: "info",
          message: "User cancelled login flow",
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        captureEvent({
          level: "info",
          message: "User already in progress",
        });
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        captureException(error, {
          tags: { error: "play_services_not_available" },
        });
      } else {
        // some other error happened
        captureException(error, { tags: { error: "other" } });
      }
    } finally {
      runInAction(() => {
        this.isSigningIn = false;
      });
    }
  });

  // signInWithApple() {
  //   return signInWithPopup(this.auth, this.appleProvider);
  // }

  signOut = flow(function* (this: UserService) {
    return yield auth().signOut();
  });

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  getTokens = flow(function* (this: UserService) {
    if (this.isSigningIn) return this.accessToken;
    runInAction(() => {
      this.isSigningIn = true;
    });
    try {
      const { accessToken } = yield GoogleSignin.getTokens();
      runInAction(() => {
        this.accessToken = accessToken;
        this.isSigningIn = false;
      });

      return accessToken;
    } catch (error) {
      captureException(error, {
        tags: { error: "get_tokens" },
        user: this.user,
      });
    }
  });

  private readonly getMe = flow(function* (this: UserService) {
    try {
      if (this.user === null) return null;
      const token = yield this.getTokens();
      if (!token) return null;

      const headers = buildHeaders({
        token,
        email: this.user.email,
        uid: this.user.providerData[0].uid,
      });

      const response = yield fetch(`${API_URL}/profile/me`, {
        method: "GET",
        headers,
      });

      const json = yield response.json();
      if (response.status === 403 || json.statusCode === 403) {
        this.setBackendUser(null);
        return null;
      }

      this.setBackendUser(json as BackendUser);
      return json;
    } catch (error) {
      console.error("[UserService].Err", error);
      this.setBackendUser(null);
      captureException(error, {
        tags: { error: "get_me" },
        user: this.user,
      });
    }
  });

  createWebUrl = async () => {
    try {
      const token = this.accessToken;
      const userId = this.user.providerData[0].uid;

      const signature = await sign({ userId, token }, AUTH_JWT_SIGNATURE, {
        alg: "HS256",
      });

      const url = `${API_URL}/user/profile/access?signature=${signature}`;
      return url;
    } catch (error) {
      captureException(error, {
        tags: { error: "create_web_url" },
        user: this.user,
      });
    }
  };
}

const userService = new UserService();
export default userService;
