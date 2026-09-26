import type { CartId, AccountId, ShippingAddress } from "./index";

export interface CheckoutRequest {
  readonly cartId: CartId;
  readonly accountId: AccountId;
  readonly shopper: CheckoutShopper;
  readonly fulfillment: CheckoutFulfillment;
}

export interface CheckoutShopper {
  readonly recipientName: string;
  readonly phone: string | null;
}

export type CheckoutFulfillment = CheckoutDelivery | CheckoutPickup;

export interface CheckoutDelivery {
  readonly method: "delivery";
  readonly address: ShippingAddress;
}

export interface CheckoutPickup {
  readonly method: "pickup";
  readonly branchId: string;
}

export interface DemoCheckoutPricingPolicy {
  readonly discount: number;
  readonly taxRate: number;
  readonly deliveryFee: number;
}

export const DEFAULT_DEMO_CHECKOUT_PRICING_POLICY: DemoCheckoutPricingPolicy = Object.freeze({
  discount: 0,
  taxRate: 0,
  deliveryFee: 350_000,
});
