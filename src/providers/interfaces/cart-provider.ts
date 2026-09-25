import type { Cart, CartId, CartItem } from "../../domain";

export interface CartProvider {
  getCart(id: CartId): Promise<Cart | null>;
  addItem(cartId: CartId, item: CartItem): Promise<Cart>;
  updateItem(cartId: CartId, item: CartItem): Promise<Cart>;
  removeItem(cartId: CartId, itemId: string): Promise<Cart>;
  clearCart(cartId: CartId): Promise<Cart>;
}
