import type { ProductVariantId } from "./product-variant";

export interface SavedChoiceId {
  readonly id: string;
}

export interface SavedChoice {
  readonly identity: SavedChoiceId;
  readonly variantId: ProductVariantId;
  readonly status: SavedChoiceStatus;
  readonly notes: string | null;
  readonly tags: readonly string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type SavedChoiceStatus = "saved" | "shortlisted" | "archived" | "purchased";
