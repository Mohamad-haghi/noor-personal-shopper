import type { Cart, CartId, CartItem, CommerceOffer } from "../domain";
import type { CartProvider } from "../providers/interfaces/cart-provider";

export class CartService {
  constructor(private readonly provider: CartProvider) {}

  getCart(id: CartId): Promise<Cart | null> {
    return this.provider.getCart(id);
  }

  addItem(cartId: CartId, item: CartItem): Promise<Cart> {
    return this.provider.addItem(cartId, item);
  }

  async addCommerceOffer(cartId: CartId, offer: CommerceOffer, quantity = 1): Promise<Cart> {
    if (!offer.purchasable) throw new Error("این محصول برای خرید در Demo در دسترس نیست.");
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error("تعداد کالا باید حداقل یک عدد باشد.");
    return this.addItem(cartId, {
      id: "demo-cart-item-" + offer.identity.id,
      offerId: offer.identity.id,
      variantId: offer.variantId,
      quantity,
      unitPrice: offer.pricing.amount,
      currency: offer.pricing.currency,
      priceSource: offer.pricing.source,
      priceLabel: offer.pricing.label,
      addedAt: new Date(),
      notes: null,
    });
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
