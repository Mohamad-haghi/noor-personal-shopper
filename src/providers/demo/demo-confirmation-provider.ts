import type { Confirmation, ConfirmationId, OrderId } from "../../domain";

export class DemoConfirmationProvider implements ConfirmationProvider {
  async getConfirmation(id: ConfirmationId): Promise<Confirmation | null> { return null; }

  async createConfirmation(confirmation: Confirmation): Promise<Confirmation> { return confirmation; }

  async getConfirmationForOrder(orderId: OrderId): Promise<Confirmation | null> { return null; }
}
