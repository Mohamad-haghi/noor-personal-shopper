import type { CartProvider } from "../interfaces/cart-provider";
import type { Cart, CartId, CartItem } from "../../domain";

export class DemoCartProvider implements CartProvider {
  private readonly carts = new Map<string, Cart>();

  async getCart(id: CartId): Promise<Cart | null> {
    return this.carts.get(id.id) ?? null;
  }

  async addItem(cartId: CartId, item: CartItem): Promise<Cart> {
    if (item.quantity < 1 || !Number.isInteger(item.quantity)) throw new Error("Cart quantity must be a positive integer.");
    if (item.unitPrice < 0 || !Number.isFinite(item.unitPrice)) throw new Error("Cart item price must be a non-negative finite number.");
    const existing = this.carts.get(cartId.id);
    const now = new Date();
    const cart = existing ?? { identity: cartId, items: [], itemCount: 0, subtotal: 0, currency: item.currency, createdAt: now, updatedAt: now };
    if (cart.currency && cart.currency !== item.currency) throw new Error("Cart cannot contain items with different currencies.");
    const items = [...cart.items];
    const index = items.findIndex((current) => current.offerId === item.offerId);
    if (index >= 0) {
      const current = items[index];
      items[index] = { ...current, quantity: current.quantity + item.quantity };
    } else {
      items.push(item);
    }
    const updated = this.recalculate({ ...cart, items, currency: cart.currency || item.currency, updatedAt: now });
    this.carts.set(cartId.id, updated);
    return updated;
  }

  async updateItem(cartId: CartId, item: CartItem): Promise<Cart> {
    const cart = this.requireCart(cartId);
    if (item.quantity < 1 || !Number.isInteger(item.quantity)) throw new Error("Cart quantity must be a positive integer.");
    const index = cart.items.findIndex((current) => current.id === item.id);
    if (index < 0) throw new Error("Cart item not found.");
    if (item.currency !== cart.currency) throw new Error("Cart cannot contain items with different currencies.");
    const items = [...cart.items];
    items[index] = item;
    const updated = this.recalculate({ ...cart, items, updatedAt: new Date() });
    this.carts.set(cartId.id, updated);
    return updated;
  }

  async removeItem(cartId: CartId, itemId: string): Promise<Cart> {
    const cart = this.requireCart(cartId);
    const items = cart.items.filter((item) => item.id !== itemId);
    const updated = this.recalculate({ ...cart, items, updatedAt: new Date() });
    this.carts.set(cartId.id, updated);
    return updated;
  }

  async clearCart(cartId: CartId): Promise<Cart> {
    const cart = this.requireCart(cartId);
    const updated = this.recalculate({ ...cart, items: [], updatedAt: new Date() });
    this.carts.set(cartId.id, updated);
    return updated;
  }

  private requireCart(cartId: CartId): Cart {
    const cart = this.carts.get(cartId.id);
    if (!cart) throw new Error("Cart not found.");
    return cart;
  }

  private recalculate(cart: Cart): Cart {
    return {
      ...cart,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    };
  }
}
