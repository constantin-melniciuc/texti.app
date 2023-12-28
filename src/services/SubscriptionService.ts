import { API_URL } from "@env";
import userService from "./UserService";
import { buildHeaders } from "./utils";
import {
  action,
  flow,
  makeObservable,
  observable,
  runInAction,
  when,
} from "mobx";
import { captureException } from "@sentry/react-native";

export enum SUBSCRIPTION_NAMES {
  free = "free",
  basic = "basic",
  starter = "starter",
  premium = "premium",
}

export type SubscriptionType = {
  metadata: {
    internal_name: SUBSCRIPTION_NAMES;
    request_count: string;
    chat_count: string;
    web_browsing: string;
    private_requests: string;
  };
  price: {
    unit_amount_decimal: number;
  };
  description: string;
  id: number;
  name: string;
};

const SUBSCRIPTION_MAP = {
  [SUBSCRIPTION_NAMES.free]: ["free"],
  [SUBSCRIPTION_NAMES.basic]: ["free", "basic"],
  [SUBSCRIPTION_NAMES.starter]: ["free", "basic", "starter"],
  [SUBSCRIPTION_NAMES.premium]: ["free", "basic", "starter", "premium"],
};

const FREE_TIER_PRODUCT: SubscriptionType = {
  metadata: {
    internal_name: SUBSCRIPTION_NAMES.free,
    request_count: "20",
    chat_count: "5",
    web_browsing: "0",
    private_requests: "0",
  },
  price: {
    unit_amount_decimal: 0,
  },
  description: "Free",
  id: 0,
  name: "Name",
};

export class SubscriptionService {
  currentSubscription: SubscriptionType | null = null;
  subscriptions: SubscriptionType[] = [];
  coveredTiers: string[] = [];

  constructor() {
    makeObservable(this, {
      // observables
      currentSubscription: observable,
      subscriptions: observable,
      coveredTiers: observable,
      // actions
      setCurrentSubscription: action,
      isSubscriptionIncluded: action,
      // getters
      // generators
      getSubscriptions: flow,
    });

    when(
      () => userService.backendUser !== null,
      () => this.init()
    );

    when(
      () => this.subscriptions.length > 0,
      () => this.setCurrentSubscription()
    );
  }

  init = async () => {
    await this.getSubscriptions();
  };

  setCurrentSubscription = () => {
    const activeSubscription = userService.backendUser.subscription;
    const currentSubscription = this.subscriptions.find(
      (sub) => sub.metadata.internal_name === activeSubscription.name
    );

    this.currentSubscription = currentSubscription || null;
    this.coveredTiers = SUBSCRIPTION_MAP[activeSubscription.name];
  };

  isSubscriptionIncluded(subscription: SubscriptionType) {
    return this.coveredTiers.includes(subscription.metadata.internal_name);
  }

  getSubscriptions = flow(function* (this: SubscriptionService, retry = true) {
    try {
      const headers = buildHeaders({
        token: userService.accessToken,
        email: userService.user.email,
        uid: userService.user.providerData[0].uid,
      });

      const result = yield fetch(`${API_URL}/subscription/all`, {
        method: "GET",
        headers,
      });
      const json = yield result.json();
      if (result.status === 403 || (json.statusCode === 403 && retry)) {
        return this.getSubscriptions(false);
      }

      runInAction(() => {
        this.subscriptions = [FREE_TIER_PRODUCT, ...json.data];
      });
    } catch (error) {
      captureException(error, {
        tags: { error: "get_subscriptions" },
        user: userService.user,
      });
    }
  });
}

const subscriptionService = new SubscriptionService();

export default subscriptionService;
