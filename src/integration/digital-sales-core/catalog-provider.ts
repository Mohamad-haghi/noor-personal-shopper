import type { Product as NoorProduct, ProductVariant as NoorProductVariant } from "../../domain";
import type { CatalogService } from "../../services/catalog-service";
import type { Product, ProductProvider } from "digital-sales-core";
import { toDigitalSalesProduct } from "./noor-adapter";

export class NoorDigitalSalesProductProvider implements ProductProvider {
  constructor(private readonly catalogService: CatalogService) {}

  async getProducts(input?: { category?: string }): Promise<Product[]> {
    const products = await this.catalogService.listProducts();
    const mapped: Product[] = [];

    for (const product of products) {
      if (input?.category && product.attributes.category !== input.category) continue;
      const variants = await this.catalogService.listVariants(product.identity);
      mapped.push(toDigitalSalesProduct(product, variants));
    }

    return mapped;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }
}

export interface NoorCoreProductMatch {
  readonly coreProduct: Product;
  readonly noorProduct: NoorProduct;
  readonly variants: readonly NoorProductVariant[];
}
