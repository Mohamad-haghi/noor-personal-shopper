import type { ProductVariantId } from "./product-variant";

export interface SelectionProfileId {
  readonly id: string;
}

export interface SelectionProfile {
  readonly identity: SelectionProfileId;
  readonly name: string;
  readonly description: string | null;
  readonly items: readonly SelectionItem[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface SelectionItem {
  readonly variantId: ProductVariantId;
  readonly addedAt: Date;
  readonly notes: string | null;
  readonly priority: SelectionPriority;
}

export type SelectionPriority = "considering" | "interested" | "highly_interested";
