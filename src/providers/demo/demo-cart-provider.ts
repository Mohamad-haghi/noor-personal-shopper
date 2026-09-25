import type { CartProvider } from "../interfaces/cart-provider";
import type { Cart, CartId, CartItem } from "../../domain";

export class DemoCartProvider implements CartProvider {
  async getCart(_id: CartId): Promise<Cart | null> { return null; }

  async addItem(_cartId: CartId, _item: CartItem): Promise<Cart> { throw new Error("Demo cart provider is stateless; cart behavior is implemented in a later phase."); }

  async updateItem(_cartId: CartId, _item: CartItem): Promise<Cart> { throw new Error("Demo cart provider is stateless; cart behavior is implemented in a later phase."); }

  async removeItem(_cartId: CartId, _itemId: string): Promise<Cart> { throw new Error("Demo cart provider is stateless; cart behavior is implemented in a later phase."); }

  async clearCart(_cartId: CartId): Promise<Cart> { throw new Error("Demo cart provider is stateless; cart behavior is implemented in a later phase."); }
}
