import type { OrderProvider } from "../providers/interfaces/order-provider";
import type { Order, OrderId, AccountId } from "../domain";

export class OrderService {
  constructor(private readonly provider: OrderProvider) {}

  getOrder(id: OrderId): Promise<Order | null> {
    return this.provider.getOrder(id);
  }

  createOrder(order: Order): Promise<Order> {
    return this.provider.createOrder(order);
  }

  listOrders(accountId: AccountId): Promise<readonly Order[]> {
    return this.provider.listOrders(accountId);
  }
}
