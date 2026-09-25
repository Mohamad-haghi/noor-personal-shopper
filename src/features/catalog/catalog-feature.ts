import type { ProductId, ProductVariantId } from "../../domain";

export interface CatalogState {
  readonly productIds: readonly ProductId[];
  readonly searchQuery: string;
  readonly filters: CatalogFilters;
  readonly isLoading: boolean;
}

export interface CatalogFilters {
  readonly categories: readonly string[];
  readonly brands: readonly string[];
  readonly priceRange: PriceRange | null;
  readonly availability: AvailabilityFilter;
}

export interface PriceRange {
  readonly min: number | null;
  readonly max: number | null;
  readonly currency: string;
}

export type AvailabilityFilter = "all" | "in_stock" | "out_of_stock";

export class CatalogFeature {
  getState(): CatalogState {
    return {
      productIds: [],
      searchQuery: "",
      filters: {
        categories: [],
        brands: [],
        priceRange: null,
        availability: "all",
      },
      isLoading: false,
    };
  }
}

export interface ProductDetailState {
  readonly productId: ProductId | null;
  readonly variantIds: readonly ProductVariantId[];
  readonly selectedVariantId: ProductVariantId | null;
  readonly isLoading: boolean;
}
