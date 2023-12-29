import { useRouter, useSegments } from "expo-router";
import { useEffect, createContext, useState } from "react";
import userServiceInstance, {
  BackendUser,
  UserService,
} from "../services/UserService";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { observer } from "mobx-react";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  backendUser: BackendUser | null;
};

const AuthContext = createContext<AuthContextType>(null);

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

type Props = {
  children: React.ReactNode;
  service: UserService;
};

const _AuthProvider = observer(({ children, service }: Props) => {
  const [user, setUser] = useState(null);

  function onAuthStateChanged(user: FirebaseAuthTypes.User) {
    setUser(user);
    service.setUser(user);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        backendUser: service.backendUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
});

export function AuthProvider(props: Omit<Props, "service">) {
  return <_AuthProvider {...props} service={userServiceInstance} />;
}
