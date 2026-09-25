import type { OrderProvider } from "../interfaces/order-provider";
import type { Order, OrderId, AccountId } from "../../domain";

export class DemoOrderProvider implements OrderProvider {
  async getOrder(_id: OrderId): Promise<Order | null> { return null; }

  async createOrder(order: Order): Promise<Order> { return order; }

  async listOrders(_accountId: AccountId): Promise<readonly Order[]> { return []; }
}
