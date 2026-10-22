import { describe, expect, it } from "vitest";
import { DemoCatalogProvider } from "../src/providers/demo/demo-catalog-provider";
import { CatalogService } from "../src/services/catalog-service";
import { RecommendationsService } from "../src/services/recommendations-service";
import type { RecommendationContext } from "../src/domain";

const context: RecommendationContext = {
  occasion: "رانندگی و فضای باز",
  season: null,
  requestSource: "shopper_request",
  journey: {
    productType: "عینک آفتابی",
    useCase: "رانندگی و فضای باز",
    style: "کلاسیک و ماندگار",
    faceShape: null,
  },
};

describe("recommendation decision-provider boundary", () => {
  it("fails closed when the decision provider is unavailable instead of ranking locally", async () => {
    const provider = {
      generateRecommendations: async () => {
        throw new Error("provider_down");
      },
    };
    const service = new RecommendationsService(
      new CatalogService(new DemoCatalogProvider()),
      provider,
    );

    await expect(
      service.generateRecommendations({ id: "verification-shopper" }, context),
    ).rejects.toThrow("cor_recommendation_unavailable");
  });

  it("preserves safe COR diagnostic codes without exposing arbitrary provider errors", async () => {
    const knownFailure = new RecommendationsService(
      new CatalogService(new DemoCatalogProvider()),
      { generateRecommendations: async () => { throw new Error("cor_request_timeout"); } },
    );
    await expect(knownFailure.generateRecommendations({ id: "verification-shopper" }, context))
      .rejects.toThrow("cor_request_timeout");

    const unsafeFailure = new RecommendationsService(
      new CatalogService(new DemoCatalogProvider()),
      { generateRecommendations: async () => { throw new Error("secret token abc"); } },
    );
    await expect(unsafeFailure.generateRecommendations({ id: "verification-shopper" }, context))
      .rejects.toThrow("cor_recommendation_unavailable");
  });

  it("requires an explicit decision provider", () => {
    const catalog = new CatalogService(new DemoCatalogProvider());
    expect(() => new RecommendationsService(catalog, undefined as never)).toThrow(
      "cor_decision_provider_required",
    );
  });
});
