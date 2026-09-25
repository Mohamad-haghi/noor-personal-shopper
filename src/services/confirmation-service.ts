import type { ConfirmationProvider } from "../providers/interfaces/confirmation-provider";
import type { Confirmation, ConfirmationId, OrderId } from "../domain";

export class ConfirmationService {
  constructor(private readonly provider: ConfirmationProvider) {}

  getConfirmation(id: ConfirmationId): Promise<Confirmation | null> {
    return this.provider.getConfirmation(id);
  }

  createConfirmation(confirmation: Confirmation): Promise<Confirmation> {
    return this.provider.createConfirmation(confirmation);
  }

  getConfirmationForOrder(orderId: OrderId): Promise<Confirmation | null> {
    return this.provider.getConfirmationForOrder(orderId);
  }
}
