import type { CheckoutProvider } from "../interfaces/checkout-provider";
import type { CartId, Order } from "../../domain";

export class DemoCheckoutProvider implements CheckoutProvider {
  async createOrderFromCart(_cartId: CartId): Promise<Order> {
    throw new Error("Demo checkout provider is stateless; checkout behavior is implemented in a later phase.");
  }
  async validate(_cartId: CartId): Promise<readonly string[]> { return []; }
}
