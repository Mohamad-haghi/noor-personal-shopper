import { describe, expect, it } from "vitest";
import type { RecommendationContext, ShopperProfileId } from "../src/domain";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";
import { RecommendationEngine } from "../src/services/recommendation-engine";

const shopperId: ShopperProfileId = { id: "test-shopper" };

const context = (journey: NonNullable<RecommendationContext["journey"]>): RecommendationContext => ({
  occasion: null,
  season: "all_season",
  requestSource: "shopper_request",
  journey,
});

const candidates = DEMO_CATALOG_SEED.products.map((product) => ({
  product,
  variant: DEMO_CATALOG_SEED.variants.find(
    (item) => item.identity.productId.id === product.identity.id,
  )!,
}));

describe("RecommendationEngine", () => {
  it("returns at most three recommendations", () => {
    const results = new RecommendationEngine().generate(
      shopperId,
      context({
        productType: "هر دو",
        useCase: "استفاده روزمره",
        style: "مینیمال و ظریف",
        faceShape: "بیضی",
      }),
      candidates,
    );

    expect(results).toHaveLength(3);
  });

  it("maps the square face-shape journey to rectangle-compatible products", () => {
    const results = new RecommendationEngine().generate(
      shopperId,
      context({
        productType: "عینک طبی",
        useCase: "کار و جلسات",
        style: "کلاسیک و ماندگار",
        faceShape: "مربع",
      }),
      candidates,
    );

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some((result) => result.reason.explanation.includes("فرم صورت انتخاب‌شده")),
    ).toBe(true);
  });

  it("produces deterministic ranking for the same inputs", () => {
    const engine = new RecommendationEngine();
    const first = engine.generate(
      shopperId,
      context({
        productType: "عینک آفتابی",
        useCase: "رانندگی و فضای باز",
        style: "مدرن و شاخص",
        faceShape: "گرد",
      }),
      candidates,
    );
    const second = engine.generate(
      shopperId,
      context({
        productType: "عینک آفتابی",
        useCase: "رانندگی و فضای باز",
        style: "مدرن و شاخص",
        faceShape: "گرد",
      }),
      candidates,
    );

    expect(first.map((item) => item.variantId.id)).toEqual(
      second.map((item) => item.variantId.id),
    );
    expect(first.map((item) => item.score.overall)).toEqual(
      second.map((item) => item.score.overall),
    );
  });

  it("explains recommendations using matched product data", () => {
    const results = new RecommendationEngine().generate(
      shopperId,
      context({
        productType: "عینک آفتابی",
        useCase: "رانندگی و فضای باز",
        style: "مدرن و شاخص",
        faceShape: "گرد",
      }),
      candidates,
    );

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every(
        (result) =>
          result.reason.explanation.length > 0 &&
          result.reason.explanation.length <= 220,
      ),
    ).toBe(true);
  });
});
