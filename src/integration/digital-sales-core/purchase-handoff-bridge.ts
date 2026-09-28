import { DigitalSalesEngine, EYEWEAR_DOMAIN_PACK_V1, type ProductProvider, type PurchaseHandoff } from "digital-sales-core";
import type { CatalogService } from "../../services/catalog-service";

export class NoorDigitalSalesPurchaseHandoffBridge {
  private readonly engine: DigitalSalesEngine;
  private readonly provider: ProductProvider;

  constructor(private readonly catalogService: CatalogService) {
    this.provider = {
      getProducts: async () => {
        const products = await this.catalogService.listProducts();
        const result = [];
        for (const product of products) {
          const variants = await this.catalogService.listVariants(product.identity);
          const reference =
            product.externalIds.providerProductId ??
            product.externalIds.externalSystemIds.noorReference ??
            product.identity.id;
          result.push({
            id: reference,
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
                    productId: reference,
                    title: variant.name,
                    attributes: {},
                    availability: variant.availability.isAvailable,
                  })),
                }
              : {}),
          });
        }
        return result;
      },
      getProduct: async (id) => (await this.provider.getProducts()).find((product) => product.id === id),
    };
    this.engine = new DigitalSalesEngine({ productProvider: this.provider, domainPack: EYEWEAR_DOMAIN_PACK_V1 });
  }

  async create(
    sessionId: string,
    productId: string,
    variantId: string,
    destination: string,
    context: Record<string, unknown> = {},
  ): Promise<PurchaseHandoff> {
    const products = await this.provider.getProducts();
    const product = products.find((item) => item.id === productId) ?? products.find((item) => item.variants?.some((variant) => variant.id === variantId));
    if (!product) throw new Error("محصول انتخاب‌شده در Core پیدا نشد.");
    const variant = product.variants?.find((item) => item.id === variantId);
    if (!variant) throw new Error("تنوع انتخاب‌شده در Core پیدا نشد.");
    return this.engine.createPurchaseHandoff({
      sessionId,
      productId,
      variant,
      destination,
      context,
    });
  }
}
