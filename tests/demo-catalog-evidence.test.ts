import { describe, expect, it } from "vitest";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";

function productById(id: string) {
  const product = DEMO_CATALOG_SEED.products.find((item) => item.identity.id === id);
  expect(product, `expected demo catalog product ${id}`).toBeDefined();
  return product!;
}

function customAttributes(id: string): Record<string, unknown> {
  return productById(id).attributes.customAttributes as Record<string, unknown>;
}

describe("source-backed demo catalog corrections", () => {
  it("keeps Ray-Ban RB3025 181/71 lens color and temple length tied to the exact variant", () => {
    const attributes = customAttributes("noor-demo-001-ray-ban-rb3025-181-71");

    expect(attributes.lensColor).toBe("grey");
    expect(attributes.templeLengthMm).toBe(135);
    expect(attributes.sourceNote).toContain("rb3025-18171");
    expect(attributes.sourceNote).toContain("Lens width remains from the captured seed");
  });

  it("keeps CAZAL 607 variant 001 frame material source-backed without inventing unresolved facts", () => {
    const attributes = customAttributes("noor-demo-014-cazal-607-001");
    const product = productById("noor-demo-014-cazal-607-001");

    expect(product.attributes.customAttributes).toMatchObject({ frameMaterial: "acetate" });
    expect(attributes.lensWidthMm).toBe(56);
    expect(attributes.bridgeWidthMm).toBe(18);
    expect(attributes.templeLengthMm).toBe(140);
    expect(attributes.faceCompatibility).toBeNull();
    expect(attributes.sourceNote).toContain("cazal-eyewear.com/products/mod-607");
    expect(attributes.sourceNote).toContain("temple material remain unresolved");
  });

  it("does not introduce use-case suitability from these catalog fact corrections", () => {
    for (const id of [
      "noor-demo-001-ray-ban-rb3025-181-71",
      "noor-demo-014-cazal-607-001",
    ]) {
      const attributes = customAttributes(id);
      expect(attributes.useCase).toBeUndefined();
      expect(attributes.suitability).toBeUndefined();
    }
  });
});
