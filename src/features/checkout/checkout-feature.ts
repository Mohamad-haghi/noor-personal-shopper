import type { OrderId } from "../../domain";

export interface CheckoutState {
  readonly orderId: OrderId | null;
  readonly currentStep: CheckoutStep;
  readonly isLoading: boolean;
}

export type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

export class CheckoutFeature {
  getState(): CheckoutState {
    return {
      orderId: null,
      currentStep: "cart",
      isLoading: false,
    };
  }
}
