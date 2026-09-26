import type { AccountId } from "./account";
import type { ProductVariantId } from "./product-variant";

export interface SelectionProfileId {
  readonly id: string;
}

export interface SelectionProfileCriteria {
  readonly productType: string | null;
  readonly useCase: string | null;
  readonly style: string | null;
  readonly faceShape: string | null;
}

export interface SelectionProfile {
  readonly identity: SelectionProfileId;
  /**
   * Optional account ownership keeps the profile usable before sign-in while
   * allowing the same profile to become account-linked when the shopper signs in.
   */
  readonly accountId: AccountId | null;
  readonly name: string;
  readonly description: string | null;
  readonly criteria: SelectionProfileCriteria;
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
