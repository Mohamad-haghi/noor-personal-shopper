import { describe, expect, it } from "vitest";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { DemoCommerceProvider } from "../src/providers/demo/demo-commerce-provider";

describe("DemoCommerceProvider", () => {
  it("creates a demo offer for every catalog variant without changing the Product model", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const offers = await commerce.listOffers();

    expect(offers).toHaveLength(DEMO_CATALOG_SEED.variants.length);
    expect(offers.every((offer) => offer.pricing.source === "demo")).toBe(true);
    expect(offers.every((offer) => offer.pricing.amount > 0)).toBe(true);
    expect(offers.every((offer) => offer.pricing.currency === "IRR")).toBe(true);
    expect(offers.every((offer) => offer.purchasable)).toBe(true);
    expect(DEMO_CATALOG_SEED.products.every((product) => !("price" in product))).toBe(true);
  });

  it("resolves a single offer by ProductVariant identity", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog);
    const variant = DEMO_CATALOG_SEED.variants[14];

    const offer = await commerce.getOffer(variant.identity);

    expect(offer).not.toBeNull();
    expect(offer?.variantId).toEqual(variant.identity);
    expect(offer?.pricing.label).toBe("قیمت نمایشی Demo");
  });

  it("supports a configurable demo pricing policy without product-specific logic", async () => {
    const catalog = new DemoCatalogProvider();
    const commerce = new DemoCommerceProvider(catalog, {
      basePrice: 10_000_000,
      step: 500_000,
      currency: "IRR",
    });

    const offer = await commerce.getOffer(DEMO_CATALOG_SEED.variants[0].identity);

    expect(offer?.pricing.amount).toBe(10_000_000);
    expect(offer?.pricing.source).toBe("demo");
  });
});
