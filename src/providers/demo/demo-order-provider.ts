import type { OrderProvider } from "../interfaces/order-provider";
import type { Order, OrderId, AccountId } from "../../domain";

export class DemoOrderProvider implements OrderProvider {
  private readonly orders = new Map<string, Order>();

  async getOrder(id: OrderId): Promise<Order | null> {
    return this.orders.get(id.id) ?? null;
  }

  async createOrder(order: Order): Promise<Order> {
    this.orders.set(order.identity.id, order);
    return order;
  }

  async listOrders(accountId: AccountId): Promise<readonly Order[]> {
    return [...this.orders.values()].filter((order) => order.accountId.id === accountId.id);
  }
}
