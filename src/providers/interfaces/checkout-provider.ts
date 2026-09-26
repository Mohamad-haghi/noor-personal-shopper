import type { CheckoutRequest, Order } from "../../domain";

export interface CheckoutProvider {
  createOrderFromCart(request: CheckoutRequest): Promise<Order>;
  validate(request: CheckoutRequest): Promise<readonly string[]>;
}
