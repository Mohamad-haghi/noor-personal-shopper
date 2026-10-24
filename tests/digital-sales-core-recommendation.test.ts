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
          style: "مستطیلی",
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

  it("ranks an available frame matching the requested shape ahead of non-matching frames", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService);
    const products = await catalogService.listProducts();

    for (const [style, canonicalShape] of [["خلبانی", "aviator"], ["مستطیلی", "rectangular"]] as const) {
      const results = await bridge.generateRecommendations(
        { id: `shape-check-${canonicalShape}` },
        {
          occasion: null,
          season: null,
          requestSource: "shopper_request",
          journey: {
            productType: "عینک آفتابی",
            useCase: null,
            style,
            faceShape: null,
          },
        },
      );

      expect(results.length).toBeGreaterThan(0);
      const topProduct = products.find((product) => product.identity.id === results[0]?.variantId.productId.id);
      expect(topProduct).toBeDefined();
      expect(topProduct?.attributes.customAttributes.frameShapes).toContain(canonicalShape);
    }
  });

  it("preserves journey answers without treating face shape or style as approved COR criteria", async () => {
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
          style: "خلبانی",
          faceShape: "مربع",
        },
      },
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.context.journey?.productType).toBe("عینک طبی");
    expect(results[0]?.context.journey?.faceShape).toBe("مربع");
  });
});


describe("COR catalog identity mapping", () => {
  it("resolves remote recommendations whose productId is the feed product identity", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const products = await catalogService.listProducts();
    const selected = products[0];
    if (!selected) throw new Error("test_catalog_product_missing");

    let sentPreferences: Record<string, unknown> = {};
    let sentCategory: string | undefined;
    const remoteClient = {
      recommend: async (payload: unknown) => {
        const request = payload as { requestId: string; intent: { category?: string; preferences: Record<string, unknown> } };
        sentPreferences = request.intent.preferences;
        sentCategory = request.intent.category;
        return {
          contractVersion: "1.0.0",
          requestId: request.requestId,
          result: {
            source: "cor_canonical_engine",
            demoOnly: true,
            recommendations: [{
              productId: selected.identity.id,
              score: 0.92,
              matchedCriteria: ["frame-shape"],
              reasons: [{ result: "matched", criterion: "frame-shape", explanationKey: "eyewear.frame_shape_match" }],
            }],
          },
        };
      },
    } as unknown as import("../src/integration/cor-shopper-remote-client").CorShopperRemoteClient;

    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService, remoteClient);
    const results = await bridge.generateRecommendations(
      { id: "remote-verification-shopper" },
      {
        occasion: null,
        season: null,
        requestSource: "shopper_request",
        journey: { productType: "هر دو", useCase: null, style: "خلبانی", faceShape: "گرد" },
      },
    );

    expect(results).toHaveLength(1);
    expect(results[0]?.variantId.productId.id).toBe(selected.identity.id);
    expect(sentCategory).toBeUndefined();
    expect(sentPreferences.frameShapes).toBe("aviator");
    expect(results[0]?.reason.primaryReason).toBe("style_match");
    expect(results[0]?.reason.explanation).toBe("تناسب با فرم فریم انتخابی شما");
    expect(sentPreferences).not.toHaveProperty("shape");
    expect(sentPreferences).not.toHaveProperty("faceCompatibility");
  });
});
