import type { CheckoutRequest, Order } from "../domain";
import type { CheckoutProvider } from "../providers/interfaces/checkout-provider";

export class CheckoutService {
  constructor(private readonly provider: CheckoutProvider) {}

  validate(request: CheckoutRequest): Promise<readonly string[]> { return this.provider.validate(request); }
  createOrderFromCart(request: CheckoutRequest): Promise<Order> { return this.provider.createOrderFromCart(request); }
}
