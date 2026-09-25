import type { CartId, Order } from "../../domain";

export interface CheckoutProvider {
  createOrderFromCart(cartId: CartId): Promise<Order>;
  validate(cartId: CartId): Promise<readonly string[]>;
}
