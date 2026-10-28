import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("ranks products compatible with the shopper's selected face shape", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService);
    const products = await catalogService.listProducts();

    const results = await bridge.generateRecommendations(
      { id: "face-fit-check" },
      {
        occasion: null,
        season: null,
        requestSource: "shopper_request",
        journey: {
          productType: "عینک آفتابی",
          useCase: null,
          style: null,
          faceShape: "گرد",
        },
      },
    );

    expect(results.length).toBeGreaterThan(0);
    const topProduct = products.find(
      (product) => product.identity.id === results[0]?.variantId.productId.id,
    );
    expect(topProduct).toBeDefined();
    expect(topProduct?.attributes.customAttributes.faceCompatibility).toContain("round");
  });

  it("maps optional material, color and catalog gender preferences to COR canonical values", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    let sentPreferences: Record<string, unknown> = {};
    const remoteClient = {
      recommend: async (payload: unknown) => {
        const request = payload as { requestId: string; intent: { preferences: Record<string, unknown> } };
        sentPreferences = request.intent.preferences;
        return {
          contractVersion: "1.0.0",
          requestId: request.requestId,
          result: { source: "cor_canonical_engine", demoOnly: true, recommendations: [] },
        };
      },
    } as unknown as import("../src/integration/cor-shopper-remote-client").CorShopperRemoteClient;
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService, remoteClient);
    await bridge.generateRecommendations({ id: "optional-preferences" }, {
      occasion: null, season: null, requestSource: "shopper_request",
      journey: { productType: "عینک آفتابی", useCase: null, style: null, faceShape: null,
        frameMaterial: "نایلونی", frameColor: "هاوانا قهوه‌ای", gender: "زنانه" },
    });
    expect(sentPreferences.frameMaterial).toBe("nylon");
    expect(sentPreferences.frameColor).toBe("havana brown");
    expect(sentPreferences.gender).toBe("female");
  });

  it("omits optional COR criteria when the shopper selects no preference", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    let sentPreferences: Record<string, unknown> = {};
    const remoteClient = {
      recommend: async (payload: unknown) => {
        const request = payload as { requestId: string; intent: { preferences: Record<string, unknown> } };
        sentPreferences = request.intent.preferences;
        return { contractVersion: "1.0.0", requestId: request.requestId,
          result: { source: "cor_canonical_engine", demoOnly: true, recommendations: [] } };
      },
    } as unknown as import("../src/integration/cor-shopper-remote-client").CorShopperRemoteClient;
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService, remoteClient);
    await bridge.generateRecommendations({ id: "no-preference" }, {
      occasion: null, season: null, requestSource: "shopper_request",
      journey: { productType: "عینک آفتابی", useCase: null, style: null, faceShape: null,
        frameMaterial: "فرقی ندارد", frameColor: "فرقی ندارد", gender: "فرقی ندارد" },
    });
    expect(sentPreferences).not.toHaveProperty("frameMaterial");
    expect(sentPreferences).not.toHaveProperty("frameColor");
    expect(sentPreferences).not.toHaveProperty("gender");
  });

  it("preserves journey answers in recommendation context", async () => {
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
          style: "مستطیلی",
          faceShape: "مربع",
        },
      },
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.context.journey?.productType).toBe("عینک طبی");
    expect(results[0]?.context.journey?.faceShape).toBe("مربع");
  });
});



  it("sends only explicitly mandatory criteria as hard COR constraints", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    let sentPreferences: Record<string, unknown> = {};
    let sentConstraints: Record<string, unknown> = {};
    const remoteClient = {
      recommend: async (payload: unknown) => {
        const request = payload as { requestId: string; intent: { preferences: Record<string, unknown>; constraints: Record<string, unknown> } };
        sentPreferences = request.intent.preferences;
        sentConstraints = request.intent.constraints;
        return {
          contractVersion: "1.0.0",
          requestId: request.requestId,
          result: { source: "cor_canonical_engine", demoOnly: true, recommendations: [] },
        };
      },
    } as unknown as import("../src/integration/cor-shopper-remote-client").CorShopperRemoteClient;
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService, remoteClient);

    await bridge.generateRecommendations({ id: "mandatory-criteria" }, {
      occasion: null, season: null, requestSource: "shopper_request",
      journey: {
        productType: "عینک آفتابی", useCase: null, style: "گرد", faceShape: null,
        frameMaterial: "تیتانیوم",
        mandatoryCriteria: ["frameShape", "frameMaterial"],
      },
    });

    expect(sentConstraints).toEqual({ frameShapes: "round", frameMaterial: "titanium" });
    expect(sentPreferences.frameShapes).toBe("round");
    expect(sentPreferences.frameMaterial).toBe("titanium");
  });

  it("keeps selected criteria soft when no mandatory criteria are explicitly marked", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    let sentConstraints: Record<string, unknown> = {};
    const remoteClient = {
      recommend: async (payload: unknown) => {
        const request = payload as { requestId: string; intent: { constraints: Record<string, unknown> } };
        sentConstraints = request.intent.constraints;
        return {
          contractVersion: "1.0.0",
          requestId: request.requestId,
          result: { source: "cor_canonical_engine", demoOnly: true, recommendations: [] },
        };
      },
    } as unknown as import("../src/integration/cor-shopper-remote-client").CorShopperRemoteClient;
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService, remoteClient);

    await bridge.generateRecommendations({ id: "soft-criteria-default" }, {
      occasion: null, season: null, requestSource: "shopper_request",
      journey: {
        productType: "عینک آفتابی", useCase: null, style: "گرد", faceShape: null,
        frameMaterial: "تیتانیوم",
      },
    });

    expect(sentConstraints).toEqual({});
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
              matchedCriteria: ["frame-shape", "gender"],
              reasons: [
                { result: "matched", criterion: "frame-shape", explanationKey: "eyewear.frame_shape_match" },
                { result: "matched", criterion: "gender", explanationKey: "gender_matches_customer_preference" },
                { result: "unmatched", criterion: "frame-material", explanationKey: "eyewear.frame_material_match" },
              ],
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
    expect(sentPreferences.shape).toBe("aviator");
    expect(sentPreferences.frameShapes).toBe("aviator");
    expect(sentPreferences.faceCompatibility).toBe("round");
    expect(results[0]?.reason.primaryReason).toBe("style_match");
    expect(results[0]?.reason.explanation).toBe("تناسب با فرم فریم انتخابی شما · تناسب با گروه محصول انتخابی شما · با جنس فریم انتخابی شما مطابقت ندارد");
  });
});


describe("COR recommendation reconciliation diagnostics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const context = {
    occasion: null,
    season: null,
    requestSource: "shopper_request" as const,
    journey: { productType: "عینک آفتابی", useCase: null, style: null, faceShape: null },
  };

  function remoteClientWithRecommendations(recommendations: Array<{
    productId: string;
    score: number;
    matchedCriteria: string[];
    reasons: Array<{ result: string; criterion: string; explanationKey: string }>;
  }>) {
    return {
      recommend: async (payload: unknown) => ({
        contractVersion: "1.0.0",
        requestId: (payload as { requestId: string }).requestId,
        result: { source: "cor_canonical_engine", demoOnly: true, recommendations },
      }),
    } as unknown as import("../src/integration/cor-shopper-remote-client").CorShopperRemoteClient;
  }

  it("logs only counts when COR product IDs do not match the NOOR catalog", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const bridge = new NoorDigitalSalesRecommendationBridge(
      catalogService,
      remoteClientWithRecommendations([{
        productId: "unmatched-test-product",
        score: 0.8,
        matchedCriteria: [],
        reasons: [],
      }]),
    );

    const results = await bridge.generateRecommendations({ id: "diagnostic-test-shopper" }, context);

    expect(results).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith("[NOOR][COR] recommendation reconciliation", expect.objectContaining({
      outcome: "no_cor_product_ids_matched_noor_catalog",
      coreRecommendationCount: 1,
      matchedProductCount: 0,
      skippedMissingProductCount: 1,
      skippedMissingVariantCount: 0,
      finalRecommendationCount: 0,
    }));
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).not.toContain("diagnostic-test-shopper");
    expect(logged).not.toContain("unmatched-test-product");
  });

  it("does not present zero-score candidates as valid recommendations", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const bridge = new NoorDigitalSalesRecommendationBridge(
      catalogService,
      remoteClientWithRecommendations([
        { productId: "zero-score-a", score: 0, matchedCriteria: [], reasons: [] },
        { productId: "zero-score-b", score: 0, matchedCriteria: [], reasons: [] },
      ]),
    );

    const results = await bridge.generateRecommendations({ id: "zero-score-shopper" }, context);

    expect(results).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith("[NOOR][COR] recommendation reconciliation", expect.objectContaining({
      outcome: "no_positive_score_recommendations",
      coreRecommendationCount: 2,
      positiveScoreRecommendationCount: 0,
      finalRecommendationCount: 0,
    }));
  });

  it("distinguishes an empty COR recommendation list from catalog identity mismatches", async () => {
    const catalogService = new CatalogService(new DemoCatalogProvider());
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const bridge = new NoorDigitalSalesRecommendationBridge(catalogService, remoteClientWithRecommendations([]));

    const results = await bridge.generateRecommendations({ id: "diagnostic-empty-shopper" }, context);

    expect(results).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith("[NOOR][COR] recommendation reconciliation", expect.objectContaining({
      outcome: "cor_returned_empty_recommendations",
      coreRecommendationCount: 0,
      skippedMissingProductCount: 0,
      finalRecommendationCount: 0,
    }));
  });
});
