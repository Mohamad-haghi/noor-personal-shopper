import type { CartId, Order } from "../domain";
import type { CheckoutProvider } from "../providers/interfaces/checkout-provider";

export class CheckoutService {
  constructor(private readonly provider: CheckoutProvider) {}

  validate(cartId: CartId): Promise<readonly string[]> { return this.provider.validate(cartId); }
  createOrderFromCart(cartId: CartId): Promise<Order> { return this.provider.createOrderFromCart(cartId); }
}
