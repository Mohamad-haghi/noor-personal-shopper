import { describe, expect, it } from "vitest";
import { DigitalSalesEngine, type DomainPack, type Product as CoreProduct } from "digital-sales-core";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";
import { toDigitalSalesProduct } from "../src/integration/digital-sales-core/noor-adapter";

const domainPack: DomainPack = {
  id: "noor-eyewear-demo",
  version: "1.2.0",
  productAttributes: ["category", "sku", "frameMaterial", "frameColor", "frameShapes", "faceCompatibility", "gender", "uvProtection", "availability"],
  decisionCriteria: [
    { id: "available-demo-item", attribute: "availability", operator: "equals", value: true, weight: 1, matchSource: "fixed" },
    { id: "frame-material", attribute: "frameMaterial", operator: "equals", value: "acetate", weight: 3, matchSource: "intent" },
    { id: "frame-color", attribute: "frameColor", operator: "equals", value: "gold", weight: 3, matchSource: "intent" },
    { id: "frame-shape", attribute: "frameShapes", operator: "contains", value: "square", weight: 4, matchSource: "intent" },
    { id: "face-compatibility", attribute: "faceCompatibility", operator: "contains", value: "round", weight: 3, matchSource: "intent" },
    { id: "gender", attribute: "gender", operator: "equals", value: "unisex", weight: 2, matchSource: "intent" },
  ],
  scoringRules: [],
  explanationRules: [],
};

function coreProducts(overrides: Record<string, Record<string, unknown>> = {}): CoreProduct[] {
  return DEMO_CATALOG_SEED.products.map((product) => {
    const variants = DEMO_CATALOG_SEED.variants.filter((variant) => variant.identity.productId.id === product.identity.id);
    const mapped = toDigitalSalesProduct(product, variants);
    const override = overrides[product.identity.id];
    return override
      ? { ...mapped, attributes: { ...mapped.attributes, ...override } }
      : mapped;
  });
}

async function scoreCatalog(products: CoreProduct[], category: "optical" | "sunglasses" = "optical") {
  const engine = new DigitalSalesEngine({
    tenantId: "tenant-noor-oracle-test",
    domainPack,
    productProvider: { async getProducts(input) { return products.filter((p) => !input?.category || p.category === input.category); }, async getProduct(id) { return products.find((p) => p.id === id); } },
  });
  return engine.recommend({
    id: "fixed-catalog-oracle",
    sessionId: "fixed-catalog-oracle-session",
    category,
    preferences: category === "optical" ? { frameMaterial: "acetate" } : {},
    constraints: {},
    priorities: [],
    desiredAttributes: [],
    excludedAttributes: [],
  }, 20);
}

describe("independent COR canonical-engine catalog correction oracle", () => {
  it("quantifies the expected score change from correcting CAZAL frameMaterial nylon -> acetate", async () => {
    const cazalId = "1000127106";
    const before = await scoreCatalog(coreProducts({
      "noor-demo-014-cazal-607-001": { frameMaterial: "nylon" },
    }));
    const after = await scoreCatalog(coreProducts());
    const beforeCazal = before.find((item) => item.productId === cazalId);
    const afterCazal = after.find((item) => item.productId === cazalId);

    expect(beforeCazal).toBeDefined();
    expect(afterCazal).toBeDefined();
    expect(afterCazal!.score).toBeGreaterThan(beforeCazal!.score);
    expect(afterCazal!.matchedCriteria).toContain("frame-material");
    expect(beforeCazal!.unmatchedCriteria).toContain("frame-material");
    expect(afterCazal!.score - beforeCazal!.score).toBeCloseTo(0.75, 10);
  });

  it("proves Ray-Ban lensColor and templeLengthMm are non-ranking fields in Domain Pack 1.2.0", async () => {
    const baseline = await scoreCatalog(coreProducts(), "sunglasses");
    const changedNonRankingFacts = await scoreCatalog(coreProducts({
      "noor-demo-001-ray-ban-rb3025-181-71": { lensColor: "not-the-same", templeLengthMm: 999 },
    }), "sunglasses");
    expect(changedNonRankingFacts.map((item) => [item.productId, item.score, item.matchedCriteria, item.unmatchedCriteria]))
      .toEqual(baseline.map((item) => [item.productId, item.score, item.matchedCriteria, item.unmatchedCriteria]));
  });
});
