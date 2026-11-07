import { describe, expect, it } from "vitest";
import type { Product, Recommendation } from "../src/domain";
import { formatRecommendationScore, formatRecommendationScoreLabel, renderRecommendations } from "../src/ui/render-recommendations";

function makeProduct(overrides: Record<string, unknown> = {}): Product {
  return {
    identity: { id: "frame-1", source: "demo" },
    slug: "frame-one",
    name: "Ray-Ban RB3025",
    description: "Demo frame",
    attributes: {
      category: "sunglasses",
      subcategory: null,
      tags: [],
      customAttributes: {
        frameShapes: ["aviator"],
        frameMaterial: "metal",
        lensWidthMm: 58,
        bridgeWidthMm: 14,
        templeLengthMm: 135,
      },
    },
    merchandising: { isFeatured: false, isNewArrival: false, isBestSeller: false, displayPriority: 0, promotionalLabels: [] },
    media: { primaryImage: { url: "/assets/rb3025.jpg", altText: "Ray-Ban RB3025", width: 800, height: 600 }, gallery: [], videoUrl: null },
    externalIds: { sku: "SKU-001", barcode: null, providerProductId: null, externalSystemIds: {} },
    ...overrides,
  } as unknown as Product;
}

function makeRecommendation(): Recommendation {
  return {
    identity: { id: "recommendation-1" },
    shopperId: { id: "shopper-1" },
    variantId: { id: "variant-1", productId: { id: "frame-1", source: "demo" } },
    score: { overall: 0.625, styleMatch: null, budgetMatch: null, occasionMatch: null, popularityScore: null },
    reason: { primaryReason: "style_match", secondaryReasons: [], explanation: "فرم فریم با سبک انتخابی شما هماهنگ است." },
    context: { occasion: null, season: null, requestSource: "shopper_request" },
    createdAt: new Date("2026-01-01T00:00:00Z"),
    expiresAt: null,
  } as unknown as Recommendation;
}

describe("COR recommendation score display", () => {
  it("formats normalized COR scores as rounded percentages", () => {
    expect(formatRecommendationScore(1)).toBe("100");
    expect(formatRecommendationScore(0.625)).toBe("63");
    expect(formatRecommendationScore(0)).toBe("0");
  });

  it("clamps out-of-range scores and handles non-finite values", () => {
    expect(formatRecommendationScore(-0.5)).toBe("0");
    expect(formatRecommendationScore(1.5)).toBe("100");
    expect(formatRecommendationScore(Number.NaN)).toBe("—");
  });

  it("labels the value as a match score rather than a probability", () => {
    expect(formatRecommendationScoreLabel(0.625)).toBe("امتیاز تطابق 63%");
  });
});

describe("Lab-aligned COR recommendations presentation", () => {
  it("renders source-backed product imagery, COR score, reason and existing actions", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderRecommendations(root, [makeRecommendation()], [makeProduct()]);

    expect(root.innerHTML).toContain('src="/assets/rb3025.jpg"');
    expect(root.innerHTML).toContain("Ray-Ban RB3025");
    expect(root.innerHTML).toContain('aria-valuenow="63"');
    expect(root.innerHTML).toContain("فرم فریم");
    expect(root.innerHTML).toContain("فرم فریم با سبک انتخابی شما هماهنگ است.");
    expect(root.innerHTML).toContain('data-save-choice="variant-1"');
    expect(root.innerHTML).toContain('data-compare-product="variant-1"');
    expect(root.innerHTML).toContain('data-add-to-cart="variant-1"');
    expect(root.innerHTML).toContain('href="/products/frame-1"');
    expect(root.innerHTML).toContain("امتیاز تطابق نرمال‌شدهٔ موتور تصمیم‌گیری COR");
    expect(root.innerHTML).not.toContain("SMART COMPARISON");
    expect(root.innerHTML).not.toContain("Preview data");
  });

  it("uses a neutral placeholder when a product has no primary image", () => {
    const root = { innerHTML: "" } as HTMLElement;
    const product = makeProduct({ media: { primaryImage: null, gallery: [], videoUrl: null } });
    renderRecommendations(root, [makeRecommendation()], [product]);

    expect(root.innerHTML).toContain("lab-recommendation-image-placeholder");
    expect(root.innerHTML).not.toContain("<img");
  });

  it("does not fabricate a recommendation when the product mapping is missing", () => {
    const root = { innerHTML: "" } as HTMLElement;
    renderRecommendations(root, [makeRecommendation()], []);

    expect(root.innerHTML).toContain("پیشنهادی برای نمایش در دسترس نیست");
    expect(root.innerHTML).not.toContain("data-add-to-cart");
  });
});
