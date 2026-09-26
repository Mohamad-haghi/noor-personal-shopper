import type { CatalogProvider } from "../interfaces/catalog-provider";
import type { Product, ProductVariant, ProductId, ProductVariantId } from "../../domain";
import { DEMO_CATALOG_SEED } from "./demo-catalog-seed";

export interface DemoCatalogSeed {
  readonly products: readonly Product[];
  readonly variants: readonly ProductVariant[];
}

export class DemoCatalogProvider implements CatalogProvider {
  constructor(private readonly seed: DemoCatalogSeed = DEMO_CATALOG_SEED) {}

  async listProducts(): Promise<readonly Product[]> {
    return this.seed.products;
  }

  async getProduct(id: ProductId): Promise<Product | null> {
    return this.seed.products.find(
      (product) =>
        product.identity.source === id.source &&
        product.identity.id === id.id,
    ) ?? null;
  }

  async listVariants(productId: ProductId): Promise<readonly ProductVariant[]> {
    return this.seed.variants.filter(
      (variant) =>
        variant.identity.productId.source === productId.source &&
        variant.identity.productId.id === productId.id,
    );
  }

  async listAvailableVariants(productId?: ProductId): Promise<readonly ProductVariant[]> {
    return this.seed.variants.filter((variant) => {
      const matchesProduct =
        productId === undefined ||
        (variant.identity.productId.source === productId.source &&
          variant.identity.productId.id === productId.id);

      return matchesProduct && variant.availability.isAvailable;
    });
  }

  async getVariant(id: ProductVariantId): Promise<ProductVariant | null> {
    return this.seed.variants.find(
      (variant) =>
        variant.identity.productId.source === id.productId.source &&
        variant.identity.productId.id === id.productId.id &&
        variant.identity.id === id.id,
    ) ?? null;
  }
}
