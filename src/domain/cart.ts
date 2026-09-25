import type { ProductVariantId } from "./product-variant";

export interface CartId {
  readonly id: string;
}

export interface Cart {
  readonly identity: CartId;
  readonly items: readonly CartItem[];
  readonly itemCount: number;
  readonly currency: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CartItem {
  readonly id: string;
  readonly variantId: ProductVariantId;
  readonly quantity: number;
  readonly addedAt: Date;
  readonly notes: string | null;
}
