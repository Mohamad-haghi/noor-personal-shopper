import type { Order, OrderId, AccountId } from "../../domain";

export interface OrderProvider {
  getOrder(id: OrderId): Promise<Order | null>;
  createOrder(order: Order): Promise<Order>;
  listOrders(accountId: AccountId): Promise<readonly Order[]>;
}
