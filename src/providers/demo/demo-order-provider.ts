import type { Order, OrderId, AccountId } from "../../domain";

export class DemoOrderProvider implements OrderProvider {
  async getOrder(id: OrderId): Promise<Order | null> { return null; }

  async createOrder(order: Order): Promise<Order> { return order; }

  async listOrders(accountId: AccountId): Promise<readonly Order[]> { return []; }
}
