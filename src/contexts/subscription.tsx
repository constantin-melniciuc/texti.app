import { useEffect, useContext, createContext, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import productService, {
  Product,
  SubscriptionContextType,
} from "../services/ProductsService";

const SubscriptionContext = createContext<{
  subscription: SubscriptionContextType;
  refetchInfo: () => Promise<void>;
  plan: Product;
}>(null);

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider(props) {
  const [subscription, setSubscription] =
    useState<SubscriptionContextType | null>(null);

  async function onAuthStateChanged(user: FirebaseAuthTypes.User) {
    if (user) {
      await productService.init();
      setSubscription(productService.subscription);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        plan: productService.currentConfig,
        subscription: productService.subscription,
        refetchInfo: async () => {
          await productService.init();
        },
      }}
    >
      {props.children}
    </SubscriptionContext.Provider>
  );
}
