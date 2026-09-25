import type { Confirmation, ConfirmationId, OrderId } from "../../domain";

export interface ConfirmationProvider {
  getConfirmation(id: ConfirmationId): Promise<Confirmation | null>;
  createConfirmation(confirmation: Confirmation): Promise<Confirmation>;
  getConfirmationForOrder(orderId: OrderId): Promise<Confirmation | null>;
}
