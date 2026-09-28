import { describe, expect, it } from "vitest";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";
import {
  createNoorPurchaseDestination,
  toDigitalSalesProduct,
  toDigitalSalesProducts,
} from "../src/integration/digital-sales-core/noor-adapter";

describe("NOOR Digital Sales Core adapter", () => {
  it("maps the approved NOOR product reference into the universal product id", () => {
    const source = DEMO_CATALOG_SEED.products.find(
      (product) => product.identity.id === "noor-demo-015-persol-po3011-095",
    );

    expect(source).toBeDefined();

    const mapped = toDigitalSalesProduct(source!);

    expect(mapped.id).toBe("1000044519");
    expect(mapped.attributes.noorProductId).toBe("noor-demo-015-persol-po3011-095");
    expect(mapped.attributes.noorReference).toBe("1000044519");
  });

  it("preserves eyewear decision attributes for the Core Domain Pack", () => {
    const source = DEMO_CATALOG_SEED.products[0];
    const mapped = toDigitalSalesProduct(source!);

    expect(mapped.attributes.frameShapes).toEqual(["aviator"]);
    expect(mapped.attributes.frameMaterial).toBe("metal");
    expect(mapped.attributes.uvProtection).toBe("UV400");
    expect(mapped.attributes.prescriptionCapable).toBe(true);
  });

  it("maps all approved demo products without changing their source identities", () => {
    const mapped = toDigitalSalesProducts(DEMO_CATALOG_SEED.products);

    expect(mapped).toHaveLength(15);
    expect(new Set(mapped.map((product) => product.id)).size).toBe(15);
    expect(mapped.every((product) => product.attributes.source === "noor")).toBe(true);
  });

  it("keeps purchase handoff as an external destination", () => {
    const source = DEMO_CATALOG_SEED.products[14];
    const mapped = toDigitalSalesProduct(source!);
    const destination = createNoorPurchaseDestination(mapped);

    expect(destination).toContain("https://www.nooroptic.com/fa/search");
    expect(destination).toContain("controller=search");
    expect(destination).toContain("PO3011%20095");
  });
});
