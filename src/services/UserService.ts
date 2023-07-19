import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { GOOGLE_CLIENT_ID } from "@env";

GoogleSignin.configure({
  scopes: ["email", "name", "profile"],
});

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
});

// for troubleshooting see
// https://github.com/react-native-google-signin/google-signin/blob/master/docs/android-guide.md#google-login-does-not-work-when-using-internal-app-sharing
class UserService {
  accessToken: string | null = null;
  user: FirebaseAuthTypes.User | null = null;
  isSigningIn = false;
  // fetchingTokens = false;

  constructor() {}

  setUser(user: FirebaseAuthTypes.User | null) {
    this.user = user;
  }

  async signIn() {
    if (this.isSigningIn) return null;
    await GoogleSignin.signInSilently();
  }

  async isSignedIn(): Promise<boolean> {
    return await GoogleSignin.isSignedIn();
  }

  async signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
    this.isSigningIn = true;
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    try {
      const user = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(user.idToken);

      // Sign-in the user with the credential
      const result = await auth().signInWithCredential(googleCredential);

      return result;
    } catch (error) {
      console.log(error);
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
      this.isSigningIn = false;
    }
  }

  // signInWithApple() {
  //   return signInWithPopup(this.auth, this.appleProvider);
  // }

  signOut(): Promise<void> {
    return auth().signOut();
  }

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  async getTokens() {
    if (this.isSigningIn) return null;
    this.isSigningIn = true;
    const { accessToken } = await GoogleSignin.getTokens();
    this.isSigningIn = false;
    return accessToken;
  }
}

const userService = new UserService();
export default userService;
