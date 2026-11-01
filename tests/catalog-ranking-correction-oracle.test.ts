import { describe, expect, it } from "vitest";
import { DigitalSalesEngine, type DomainPack, type Product as CoreProduct } from "digital-sales-core";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";
import { DEMO_CATALOG_ATTRIBUTE_EVIDENCE, verifiedCatalogScalar } from "../src/providers/demo/demo-catalog-evidence";
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
    const custom = product.attributes.customAttributes as Record<string, unknown>;
    const reference = String(custom.noorReference);
    const evidence = DEMO_CATALOG_ATTRIBUTE_EVIDENCE[reference];
    const attributes: Record<string, unknown> = { ...mapped.attributes };
    const gatedFields = [
      ["frameMaterial", "frameMaterial"],
      ["frameColor", "frameColor"],
      ["frameShapes", "frameShapes"],
      ["faceCompatibility", "faceCompatibility"],
      ["gender", "gender"],
      ["uvProtection", "uvProtection"],
    ] as const;
    for (const [target, source] of gatedFields) {
      const value = verifiedCatalogScalar(evidence, source, custom[source]);
      if (value === null) delete attributes[target];
      else attributes[target] = value;
    }
    const override = overrides[product.identity.id];
    return override
      ? { ...mapped, attributes: { ...attributes, ...override } }
      : { ...mapped, attributes };
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
  it("withholds Valentino VA1021 3003 shape while exact-code sources disagree", () => {
    const valentino = DEMO_CATALOG_SEED.products.find((item) => item.identity.id === "noor-demo-013-valentino-va1021-3003");
    expect(valentino).toBeDefined();
    const attributes = valentino!.attributes.customAttributes as Record<string, unknown>;
    expect(attributes.frameShapes).toEqual([]);
  });

  it("withholds CAZAL's multi-material construction from scalar COR ranking", async () => {
    const cazalId = "1000127106";
    const products = coreProducts();
    const cazal = products.find((item) => item.id === cazalId);
    expect(cazal).toBeDefined();
    expect(cazal!.attributes.frameMaterial).toBeUndefined();

    const ranked = await scoreCatalog(products);
    const result = ranked.find((item) => item.productId === cazalId);
    expect(result).toBeDefined();
    expect(result!.matchedCriteria).not.toContain("frame-material");
    expect(result!.unmatchedCriteria).toContain("frame-material");
  });

  it("withholds disputed and multi-valued attributes from the current scalar ranking contract", () => {
    const products = coreProducts();
    const byId = new Map(products.map((item) => [item.id, item]));
    expect(byId.get("1000058221")?.attributes.frameShapes).toBeUndefined();
    expect(byId.get("1000058221")?.attributes.frameMaterial).toBeUndefined();
    expect(byId.get("1000104615")?.attributes.frameMaterial).toBeUndefined();
    expect(byId.get("1000104615")?.attributes.frameColor).toBeUndefined();
    expect(byId.get("1000109052")?.attributes.frameShapes).toBeUndefined();
    expect(byId.get("1000109052")?.attributes.frameMaterial).toBeUndefined();
    expect(byId.get("1000100480")?.attributes.frameColor).toBeUndefined();
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
