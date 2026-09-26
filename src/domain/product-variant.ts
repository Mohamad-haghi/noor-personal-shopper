import type { ProductId } from "./product";

export interface ProductVariantId {
  readonly id: string;
  readonly productId: ProductId;
}

export interface ProductVariant {
  readonly identity: ProductVariantId;
  readonly name: string;
  readonly sku: string | null;
  readonly attributes: VariantAttributes;
  readonly availability: VariantAvailability;
}

export interface VariantAttributes {
  readonly color: string | null;
  readonly size: string | null;
  readonly material: string | null;
  readonly customAttributes: Readonly<Record<string, unknown>>;
}

export interface VariantAvailability {
  /**
   * Explicit provenance of availability.
   * "demo" is synthetic availability used only by the executable Demo dataset.
   * "inventory" represents a real NOOR/production inventory source.
   * "unknown" means availability has not been established and must not be
   * interpreted as out-of-stock.
   */
  readonly source: AvailabilitySource;
  readonly isAvailable: boolean;
  readonly availabilityStatus: AvailabilityStatus;
  readonly quantityAvailable: number | null;
  readonly lowStockThreshold: number | null;
}

export type AvailabilitySource = "demo" | "inventory" | "unknown";

export type AvailabilityStatus = "in_stock" | "low_stock" | "out_of_stock" | "discontinued" | "unknown";
