import type { ProductVariantId } from "./product-variant";

export interface CartId {
  readonly id: string;
}

export interface Cart {
  readonly identity: CartId;
  readonly items: readonly CartItem[];
  readonly itemCount: number;
  readonly subtotal: number;
  readonly currency: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CartItem {
  readonly id: string;
  readonly offerId: string;
  readonly variantId: ProductVariantId;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly currency: string;
  readonly priceSource: "demo" | "commerce" | "unknown";
  readonly priceLabel: string;
  readonly addedAt: Date;
  readonly notes: string | null;
}
