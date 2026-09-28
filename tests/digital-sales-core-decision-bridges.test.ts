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
    const result = await bridge.compare(products.slice(0, 2), ["frameMaterial", "frameColor"]);
    expect(result.coreProductIds).toHaveLength(2);
    expect(result.attributes).toEqual(["frameMaterial", "frameColor"]);
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
});
