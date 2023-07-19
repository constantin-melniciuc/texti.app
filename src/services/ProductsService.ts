import { API_URL } from "@env";
import userService from "./UserService";
import { buildHeaders } from "./utils";

export enum SubscriptionName {
  free = "free",
  basic = "basic",
  starter = "starter",
  premium = "premium",
}

export enum SubscriptionType {
  monthly = "monthly",
  yearly = "yearly",
}

export type SubscriptionContextType = {
  name: SubscriptionName;
  status: "paid" | "unpaid";
  subscriptionType: SubscriptionType;
};

export type Product = {
  metadata: {
    internal_name: SubscriptionName;
    request_count: string;
    chat_count: string;
  };
  price: {
    unit_amount_decimal: number;
  };
  description: string;
  id: number;
  name: string;
};

const SUBSCRIPTION_MAP = {
  [SubscriptionName.free]: ["free"],
  [SubscriptionName.basic]: ["free", "basic"],
  [SubscriptionName.starter]: ["free", "basic", "starter"],
  [SubscriptionName.premium]: ["free", "basic", "starter", "premium"],
};

const FREE_TIER_PRODUCT: Product = {
  metadata: {
    internal_name: SubscriptionName.free,
    request_count: "20",
    chat_count: "5",
  },
  price: {
    unit_amount_decimal: 0,
  },
  description: "Free",
  id: 0,
  name: "Name",
};

class ProductsService {
  products: Product[] = [];
  subscription: SubscriptionContextType | null = null;

  constructor() {}

  init() {
    this.fetchProducts();
    this.fetchSubscriptionInfo();
  }

  get currentConfig(): Product {
    if (!this.subscription) {
      return FREE_TIER_PRODUCT;
    }

    const config = this.products.find((product) =>
      this._isIncludedInActiveSubscription(product)
    );

    if (!config) {
      return FREE_TIER_PRODUCT;
    }

    return config;
  }

  async fetchSubscriptionInfo(retry = true) {
    const token = await userService.getTokens();
    const headers = buildHeaders({
      token,
      email: userService.user.email,
      uid: userService.user.providerData[0].uid,
    });

    try {
      const result = await fetch(`${API_URL}/user/me`, {
        method: "GET",
        headers,
      });
      const json = await result.json();

      this.subscription = json.subscription;

      if (json.statusCode === 403 && retry) {
        return this.fetchSubscriptionInfo(false);
      }

      return json.subscription;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchProducts(retry = true) {
    try {
      const token = await userService.getTokens();
      const headers = buildHeaders({
        token,
        email: userService.user.email,
        uid: userService.user.providerData[0].uid,
      });

      const result = await fetch(`${API_URL}/subscription/all?version=v2`, {
        method: "GET",
        headers,
      });
      const json = await result.json();
      if (json.statusCode === 403 && retry) {
        return this.fetchProducts(false);
      }

      if (json.statusCode < 300) {
        this.products = json.products;

        return json.products;
      }

      return [];
    } catch (error) {
      console.log(">> product service", error);
    }
  }

  private _isIncludedInActiveSubscription(product) {
    const productInternalName = product.metadata
      .internal_name as SubscriptionName;
    return SUBSCRIPTION_MAP[this.subscription.name].includes(
      productInternalName
    );
  }
}

const productService = new ProductsService();

export default productService;
