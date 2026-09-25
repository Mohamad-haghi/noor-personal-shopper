import type { Product, ProductVariant, ProductId, ProductVariantId } from "../../domain";

export interface CatalogProvider {
  listProducts(): Promise<readonly Product[]>;
  getProduct(id: ProductId): Promise<Product | null>;
  listVariants(productId: ProductId): Promise<readonly ProductVariant[]>;
  getVariant(id: ProductVariantId): Promise<ProductVariant | null>;
}
