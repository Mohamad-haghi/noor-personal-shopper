import { DigitalSalesEngine, EYEWEAR_DOMAIN_PACK_V1, type Product as CoreProduct } from "digital-sales-core";
import type { Comparison, Product } from "../../domain";
import type { CatalogService } from "../../services/catalog-service";

export class NoorDigitalSalesComparisonBridge {
  private readonly engine: DigitalSalesEngine;

  constructor(private readonly catalogService: CatalogService) {
    this.engine = new DigitalSalesEngine({
      productProvider: {
        getProducts: async () => this.getCoreProducts(),
        getProduct: async (id) => (await this.getCoreProducts()).find((product) => product.id === id),
      },
      domainPack: EYEWEAR_DOMAIN_PACK_V1,
    });
  }

  private async getCoreProducts(): Promise<CoreProduct[]> {
    const products = await this.catalogService.listProducts();
    const mapped: CoreProduct[] = [];
    for (const product of products) {
      const variants = await this.catalogService.listVariants(product.identity);
      const externalId =
        product.externalIds.providerProductId ??
        product.externalIds.externalSystemIds.noorReference ??
        product.identity.id;
      mapped.push({
        id: externalId,
        title: product.name,
        category: product.attributes.category ?? "eyewear",
        attributes: Object.fromEntries(
          Object.entries(product.attributes.customAttributes).filter(([, value]) =>
            typeof value === "string" || typeof value === "number" || typeof value === "boolean",
          ),
        ) as Record<string, string | number | boolean>,
        ...(variants.length
          ? {
              variants: variants.map((variant) => ({
                id: variant.identity.id,
                productId: externalId,
                title: variant.name,
                attributes: Object.fromEntries(
                  Object.entries(variant.attributes.customAttributes).filter(([, value]) =>
                    typeof value === "string" || typeof value === "number" || typeof value === "boolean",
                  ),
                ) as Record<string, string | number | boolean>,
                availability: variant.availability.isAvailable,
              })),
            }
          : {}),
      });
    }
    return mapped;
  }

  async compare(
    products: readonly Product[],
    attributes: readonly string[],
  ): Promise<{ coreProductIds: string[]; attributes: string[]; differences: unknown[] }> {
    const coreProducts = await this.getCoreProducts();
    const byNoorId = new Map(products.map((product) => [product.identity.id, product]));
    const selected = coreProducts.filter((coreProduct) =>
      products.some((product) => {
        const externalId =
          product.externalIds.providerProductId ??
          product.externalIds.externalSystemIds.noorReference ??
          product.identity.id;
        return externalId === coreProduct.id;
      }),
    );
    const comparison = this.engine.compare(selected, [...attributes]);
    return comparison;
  }
}
