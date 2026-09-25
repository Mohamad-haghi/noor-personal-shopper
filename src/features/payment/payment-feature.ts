import type { PaymentId, OrderId } from "../../domain";

export interface PaymentState {
  readonly paymentId: PaymentId | null;
  readonly orderId: OrderId | null;
  readonly status: PaymentFlowStatus;
  readonly isLoading: boolean;
}

export type PaymentFlowStatus = "idle" | "processing" | "success" | "failed";

export class PaymentFeature {
  getState(): PaymentState {
    return {
      paymentId: null,
      orderId: null,
      status: "idle",
      isLoading: false,
    };
  }
}
