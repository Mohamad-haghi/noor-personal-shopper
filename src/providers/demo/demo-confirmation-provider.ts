import type { ConfirmationProvider } from "../interfaces/confirmation-provider";
import type { Confirmation, ConfirmationId, OrderId } from "../../domain";

export class DemoConfirmationProvider implements ConfirmationProvider {
  async getConfirmation(_id: ConfirmationId): Promise<Confirmation | null> { return null; }

  async createConfirmation(confirmation: Confirmation): Promise<Confirmation> { return confirmation; }

  async getConfirmationForOrder(_orderId: OrderId): Promise<Confirmation | null> { return null; }
}
