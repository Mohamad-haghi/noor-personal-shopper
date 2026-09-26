import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { DemoSearchProvider } from "../src/providers/demo/demo-search-provider";
import { SearchService } from "../src/services/search-service";

describe("D4 Smart Discovery Search", () => {
  function service(): SearchService { return new SearchService(new DemoSearchProvider(new DemoCatalogProvider())); }

  it("supports keyword search by model and product name", async () => {
    const result = await service().search({ text: "PO3011", limit: 12 });
    expect(result.total).toBeGreaterThan(0);
    expect(result.results.some((item) => item.productId.id.includes("persol-po3011"))).toBe(true);
  });

  it("supports controlled natural-language synonyms", async () => {
    const result = await service().search({ text: "عینک طبی مشکی کلاسیک", limit: 12 });
    expect(result.total).toBeGreaterThan(0);
    expect(result.results.some((item) => item.matchedAttributes.includes("optical"))).toBe(true);
  });

  it("exposes match reasons and Frame DNA matching", async () => {
    const result = await service().search({ text: "گرد", limit: 12 });
    expect(result.total).toBeGreaterThan(0);
    expect(result.results.some((item) => item.matchedAttributes.includes("frame-dna"))).toBe(true);
    expect(result.results.every((item) => item.reasons.length > 0)).toBe(true);
  });

  it("recovers cleanly from no-result queries", async () => {
    const result = await service().search({ text: "کاملاً ناشناخته xyz", limit: 12 });
    expect(result.total).toBe(0);
  });

  it("finds similar frames without product-specific search logic", async () => {
    const catalog = new DemoCatalogProvider();
    const products = await catalog.listProducts();
    const similar = await service().findSimilar(products[0].identity, 4);
    expect(similar.length).toBeGreaterThan(0);
    expect(similar.every((item) => item.productId.id !== products[0].identity.id)).toBe(true);
  });
}
