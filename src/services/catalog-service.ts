import type { CatalogProvider } from "../providers/interfaces/catalog-provider";
import type { Product, ProductVariant, ProductId, ProductVariantId } from "../domain";

export class CatalogService {
  constructor(private readonly provider: CatalogProvider) {}

  listProducts(): Promise<readonly Product[]> {
    return this.provider.listProducts();
  }

  getProduct(id: ProductId): Promise<Product | null> {
    return this.provider.getProduct(id);
  }

  listVariants(productId: ProductId): Promise<readonly ProductVariant[]> {
    return this.provider.listVariants(productId);
  }

  getVariant(id: ProductVariantId): Promise<ProductVariant | null> {
    return this.provider.getVariant(id);
  }
}
