import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { CatalogService } from "../src/services/catalog-service";
import { NoorDigitalSalesComparisonBridge } from "../src/integration/digital-sales-core/comparison-bridge";
import { NoorDigitalSalesPurchaseHandoffBridge } from "../src/integration/digital-sales-core/purchase-handoff-bridge";

describe("NOOR Digital Sales Core decision-to-purchase bridges", () => {
  it("routes comparison through Core", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const products = await catalogService.listProducts();
    const bridge = new NoorDigitalSalesComparisonBridge(catalogService);
    const result = await bridge.compare(products.slice(0, 2), ["frame", "shape"]);
    expect(result.productIds).toHaveLength(2);
    expect(result.attributes).toEqual(["frame", "shape"]);
    expect(result.differences).toHaveLength(2);
  });

  it("creates a Core purchase handoff without owning checkout", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const product = (await catalogService.listProducts())[0];
    const variant = (await catalogService.listVariants(product.identity))[0];
    const productId =
      product.externalIds.providerProductId ??
      product.externalIds.externalSystemIds.noorReference ??
      product.identity.id;
    const bridge = new NoorDigitalSalesPurchaseHandoffBridge(catalogService);
    const handoff = await bridge.create(
      "noor-verification-session",
      productId,
      variant.identity.id,
      "https://www.nooroptic.com/fa/search",
      { source: "noor-personal-shopper" },
    );
    expect(handoff.productId).toBe(productId);
    expect(handoff.variantId).toBe(variant.identity.id);
    expect(handoff.quantity).toBe(1);
    expect(handoff.destination).toContain("nooroptic.com");
  });

  it("uses the catalog feed product identities for remote COR comparison", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const products = (await catalogService.listProducts()).slice(0, 2);
    let sentProductIds: string[] = [];
    const remoteClient = {
      compare: async (payload: unknown) => {
        const request = payload as { requestId: string; productIds: string[]; attributes: string[] };
        sentProductIds = request.productIds;
        return {
          contractVersion: "1.0.0",
          requestId: request.requestId,
          result: {
            source: "cor_canonical_engine",
            demoOnly: true,
            comparison: {
              productIds: request.productIds,
              attributes: request.attributes,
              differences: [],
            },
          },
        };
      },
    } as unknown as import("../src/integration/cor-shopper-remote-client").CorShopperRemoteClient;
    const bridge = new NoorDigitalSalesComparisonBridge(catalogService, remoteClient);
    const result = await bridge.compare(products, ["frame", "shape"]);

    expect(sentProductIds).toEqual(products.map((product) => product.identity.id));
    expect(result.productIds).toEqual(sentProductIds);
  });
});
