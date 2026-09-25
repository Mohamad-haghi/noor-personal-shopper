import type { Product, ProductVariant, ProductId, ProductVariantId } from "../../domain";

export class DemoCatalogProvider implements CatalogProvider {
  async listProducts(): Promise<readonly Product[]> { return []; }

  async getProduct(id: ProductId): Promise<Product | null> { return null; }

  async listVariants(productId: ProductId): Promise<readonly ProductVariant[]> { return []; }

  async getVariant(id: ProductVariantId): Promise<ProductVariant | null> { return null; }
}
