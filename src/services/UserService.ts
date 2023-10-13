import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { API_URL, GOOGLE_CLIENT_ID } from "@env";
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
import { AUTH_JWT_SIGNATURE } from "@env";

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
class UserService {
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
      getMe: flow,
      getTokens: flow,
      signIn: flow,
      signInWithGoogle: flow,
      signOut: flow,
    });

    when(
      () =>
        this.accessToken !== null &&
        this.isSigningIn === false &&
        this.backendUser === null,
      () => {
        this.getMe();
      }
    );
  }

  setUser(user: FirebaseAuthTypes.User | null) {
    this.user = user;
    this.refreshTokens();
  }

  setBackendUser(backendUser: BackendUser | null) {
    this.backendUser = backendUser;
  }

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
      const googleCredential = auth.GoogleAuthProvider.credential(user.idToken);

      // Sign-in the user with the credential
      const result = yield auth().signInWithCredential(googleCredential);

      return result;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
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
    return auth().signOut();
  });

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  getTokens = flow(function* (this: UserService) {
    if (this.isSigningIn) return this.accessToken;
    runInAction(() => {
      this.isSigningIn = true;
    });
    const { accessToken } = yield GoogleSignin.getTokens();

    runInAction(() => {
      this.accessToken = accessToken;
      this.isSigningIn = false;
    });
    return accessToken;
  });

  refreshTokens = flow(function* (this: UserService) {
    const { accessToken } = yield GoogleSignin.getTokens();
    runInAction(() => {
      this.accessToken = accessToken;
      this.isSigningIn = false;
    });
  });

  getMe = flow(function* (this: UserService) {
    try {
      const token = yield this.getTokens();

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

      this.setBackendUser(json);
      return json;
    } catch (error) {
      console.error("[UserService].Err", error);
      this.setBackendUser(null);
    }
  });

  createWebUrl = async () => {
    const token = this.accessToken;
    const userId = this.user.providerData[0].uid;

    const signature = await sign({ userId, token }, AUTH_JWT_SIGNATURE, {
      alg: "HS256",
    });

    const url = `${API_URL}/user/profile/access?signature=${signature}`;
    return url;
  };
}

const userService = new UserService();
export default userService;
