import type { ProductVariantId } from "./product-variant";

export interface ComparisonId {
  readonly id: string;
}

export interface Comparison {
  readonly identity: ComparisonId;
  readonly name: string | null;
  readonly items: readonly ComparisonItem[];
  readonly criteria: readonly ComparisonCriteria[];
  readonly createdAt: Date;
}

export interface ComparisonItem {
  readonly variantId: ProductVariantId;
  readonly addedAt: Date;
  readonly position: number;
}

export type ComparisonCriteria = 
  | "price"
  | "quality"
  | "style"
  | "brand"
  | "material"
  | "color"
  | "size"
  | "availability"
  | "custom";
