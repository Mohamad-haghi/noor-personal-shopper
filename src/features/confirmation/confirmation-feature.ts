import type { ConfirmationId, OrderId } from "../../domain";

export interface ConfirmationState {
  readonly confirmationId: ConfirmationId | null;
  readonly orderId: OrderId | null;
  readonly isLoading: boolean;
}

export class ConfirmationFeature {
  getState(): ConfirmationState {
    return {
      confirmationId: null,
      orderId: null,
      isLoading: false,
    };
  }
}
