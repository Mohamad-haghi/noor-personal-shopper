import type { CartProvider } from "../providers/interfaces/cart-provider";
import type { Cart, CartId, CartItem } from "../domain";

export class CartService {
  constructor(private readonly provider: CartProvider) {}

  getCart(id: CartId): Promise<Cart | null> {
    return this.provider.getCart(id);
  }

  addItem(cartId: CartId, item: CartItem): Promise<Cart> {
    return this.provider.addItem(cartId, item);
  }

  updateItem(cartId: CartId, item: CartItem): Promise<Cart> {
    return this.provider.updateItem(cartId, item);
  }

  removeItem(cartId: CartId, itemId: string): Promise<Cart> {
    return this.provider.removeItem(cartId, itemId);
  }

  clearCart(cartId: CartId): Promise<Cart> {
    return this.provider.clearCart(cartId);
  }
}
