import { useRouter, useSegments } from "expo-router";
import { useEffect, useContext, createContext, useState } from "react";
import userService, { BackendUser } from "../services/UserService";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

type AuthContextType = {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  user: FirebaseAuthTypes.User | null;
  backendUser: BackendUser | null;
};

const AuthContext = createContext<AuthContextType>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, segments]);
}

export function AuthProvider(props) {
  const [user, setUser] = useState(null);

  const loginWithGoogle = async () => {
    await userService.signInWithGoogle();
  };

  const signOut = async () => {
    await userService.signOut();
  };

  function onAuthStateChanged(user: FirebaseAuthTypes.User) {
    setUser(user);
    userService.setUser(user);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signInWithGoogle: loginWithGoogle,
        signOut,
        user,
        backendUser: userService.backendUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
