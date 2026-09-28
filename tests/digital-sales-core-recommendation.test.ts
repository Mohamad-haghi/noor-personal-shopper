import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { CatalogService } from "../src/services/catalog-service";
import { NoorDigitalSalesRecommendationBridge } from "../src/integration/digital-sales-core/recommendation-bridge";

describe("NOOR Digital Sales Core recommendation bridge", () => {
  it("uses the Core engine and returns at most three NOOR recommendations", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService);

    const results = await bridge.generateRecommendations(
      { id: "verification-shopper" },
      {
        occasion: "رانندگی و فضای باز",
        season: null,
        requestSource: "shopper_request",
        journey: {
          productType: "عینک آفتابی",
          useCase: "رانندگی و فضای باز",
          style: "مدرن و شاخص",
          faceShape: "گرد",
        },
      },
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(3);
    expect(results.every((item) => item.variantId.id.length > 0)).toBe(true);
    expect(results.every((item) => item.score.overall >= 0)).toBe(true);
    expect(results.every((item) => item.reason.explanation)).toBe(true);
  });

  it("passes journey context into Core so product type and face shape affect results", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService);

    const results = await bridge.generateRecommendations(
      { id: "verification-shopper" },
      {
        occasion: null,
        season: null,
        requestSource: "shopper_request",
        journey: {
          productType: "عینک طبی",
          useCase: "کار و جلسات",
          style: "کلاسیک و ماندگار",
          faceShape: "مربع",
        },
      },
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.context.journey?.productType).toBe("عینک طبی");
    expect(results[0]?.context.journey?.faceShape).toBe("مربع");
  });
});
