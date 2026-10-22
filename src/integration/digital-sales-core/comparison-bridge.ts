import { DigitalSalesEngine, EYEWEAR_DOMAIN_PACK_V1, type Product as CoreProduct } from "digital-sales-core";
import type { Product } from "../../domain";
import type { Comparison as CoreComparison } from "digital-sales-core";
import type { CatalogService } from "../../services/catalog-service";
import type { CorShopperRemoteClient } from "../cor-shopper-remote-client";

export class NoorDigitalSalesComparisonBridge {
  private readonly engine: DigitalSalesEngine;

  constructor(
    private readonly catalogService: CatalogService,
    private readonly remoteClient?: CorShopperRemoteClient,
  ) {
    this.engine = new DigitalSalesEngine({
      // Offline-only fallback; integrated operations use COR's authenticated tenant scope.
      tenantId: "tenant-noor-demo-local",
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
  ): Promise<CoreComparison> {
    if (this.remoteClient) {
      // COR's pinned catalog feed uses the NOOR demo product identity as its ID.
      // External NOOR reference numbers are separate metadata and are not COR product IDs.
      const productIds = products.map((product) => product.identity.id);
      // The active COR request boundary permits lowercase keys only. Map the
      // local catalog's camelCase fields to the pinned source mapping's fields.
      const remoteAttributeMap: Readonly<Record<string, string>> = {
        frameShapes: "shape",
        frameMaterial: "frame",
        frame: "frame",
        shape: "shape",
        gender: "gender",
        sku: "sku",
      };
      const remoteAttributes = [...new Set(
        attributes.map((attribute) => remoteAttributeMap[attribute])
          .filter((attribute): attribute is string => typeof attribute === "string"),
      )];
      if (remoteAttributes.length === 0) throw new Error("cor_comparison_attributes_unsupported");

      const requestId = "noor-compare-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      const response = await this.remoteClient.compare<{
        contractVersion: string;
        requestId: string;
        result?: { source?: string; demoOnly?: boolean; comparison?: CoreComparison };
      }>({
        contractVersion: "1.0.0",
        requestId,
        sessionId: "noor-session-" + globalThis.crypto.randomUUID(),
        productIds,
        attributes: [...attributes],
      });
      if (response.contractVersion !== "1.0.0" || response.requestId !== requestId ||
          response.result?.source !== "cor_canonical_engine" || response.result.demoOnly !== true ||
          !response.result.comparison) {
        throw new Error("cor_comparison_response_invalid");
      }
      return response.result.comparison;
    }

    const coreProducts = await this.getCoreProducts();
    const selected = coreProducts.filter((coreProduct) =>
      products.some((product) => {
        const externalId =
          product.externalIds.providerProductId ??
          product.externalIds.externalSystemIds.noorReference ??
          product.identity.id;
        return externalId === coreProduct.id;
      }),
    );
    return this.engine.compare(selected, [...attributes]);
  }
}
