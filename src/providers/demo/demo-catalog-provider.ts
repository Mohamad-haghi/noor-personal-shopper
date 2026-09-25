import type { CatalogProvider } from "../interfaces/catalog-provider";
import type { Product, ProductVariant, ProductId, ProductVariantId } from "../../domain";

export class DemoCatalogProvider implements CatalogProvider {
  async listProducts(): Promise<readonly Product[]> { return []; }

  async getProduct(_id: ProductId): Promise<Product | null> { return null; }

  async listVariants(_productId: ProductId): Promise<readonly ProductVariant[]> { return []; }

  async getVariant(_id: ProductVariantId): Promise<ProductVariant | null> { return null; }
}
