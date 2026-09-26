import { describe, expect, it } from "vitest";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";
import { getNoorInventoryDestination } from "../src/ui/noor-inventory-link";

describe("NOOR inventory smart link", () => {
  it("builds a destination from structured external product identifiers", () => {
    const product = DEMO_CATALOG_SEED.products[14];
    const destination = getNoorInventoryDestination(product);

    expect(destination).not.toBeNull();
    expect(destination?.reference).toBe("1000044519");
    expect(destination?.url).toContain("www.nooroptic.com/fa/search");
    expect(destination?.url).toContain("PO3011");
  });

  it("does not depend on demo product IDs", () => {
    const product = {
      ...DEMO_CATALOG_SEED.products[0],
      identity: { id: "another-demo-id", source: "demo" as const },
    };
    const destination = getNoorInventoryDestination(product);

    expect(destination?.reference).toBe(product.externalIds.providerProductId);
  });

  it("returns null when no external inventory identifier exists", () => {
    const product = {
      ...DEMO_CATALOG_SEED.products[0],
      externalIds: {
        sku: null,
        barcode: null,
        providerProductId: null,
        externalSystemIds: {},
      },
    };
    expect(getNoorInventoryDestination(product)).toBeNull();
  });
});
