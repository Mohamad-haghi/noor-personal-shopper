import type { ProductVariantId } from "./product-variant";

export interface CommerceOffer {
  readonly identity: CommerceOfferId;
  readonly variantId: ProductVariantId;
  readonly pricing: CommercePricing;
  readonly purchasable: boolean;
  readonly availability: CommerceAvailability;
}

export interface CommerceOfferId {
  readonly id: string;
}

export interface CommercePricing {
  readonly amount: number;
  readonly currency: string;
  readonly source: CommercePriceSource;
  readonly label: string;
}

export type CommercePriceSource = "demo" | "commerce" | "unknown";

export interface CommerceAvailability {
  readonly source: CommerceAvailabilitySource;
  readonly isAvailable: boolean;
}

export type CommerceAvailabilitySource = "demo" | "inventory" | "unknown";
