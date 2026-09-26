import type { ConfirmationProvider } from "../interfaces/confirmation-provider";
import type { Confirmation, ConfirmationId, OrderId } from "../../domain";

export class DemoConfirmationProvider implements ConfirmationProvider {
  private readonly confirmations = new Map<string, Confirmation>();

  async getConfirmation(id: ConfirmationId): Promise<Confirmation | null> {
    return this.confirmations.get(id.id) ?? null;
  }

  async createConfirmation(confirmation: Confirmation): Promise<Confirmation> {
    this.confirmations.set(confirmation.identity.id, confirmation);
    return confirmation;
  }

  async getConfirmationForOrder(orderId: OrderId): Promise<Confirmation | null> {
    return [...this.confirmations.values()].find((item) => item.orderId.id === orderId.id) ?? null;
  }
}
