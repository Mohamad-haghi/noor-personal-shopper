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

  it("preserves Prada PR03YS 2AU6S1 material components without collapsing them to one frame material", () => {
    const attributes = customAttributes("noor-demo-005-prada-pr03ys-2au6s1");
    expect(attributes.frameMaterial).toBeNull();
    expect(attributes.frameMaterialComponents).toEqual(["plastic", "metal"]);
    expect(attributes.templeMaterial).toBe("metal");
    expect(attributes.lensColor).toBe("brown two-tone");
    expect(attributes.sourceNote).toContain("PR-03YS-2AU6S1.html");
  });

  it("records exact DG2204 12988G lens/frame facts and withholds unsupported shape and fit", () => {
    const attributes = customAttributes("noor-demo-006-dolce-gabbana-dg2204-12988g-64");
    const product = productById("noor-demo-006-dolce-gabbana-dg2204-12988g-64");
    expect(attributes.lensColor).toBe("grey");
    expect(attributes.frameColorDescription).toBe("pink gold");
    expect(attributes.frameShapes).toEqual([]);
    expect(attributes.faceCompatibility).toBeNull();
    expect(attributes.sourceNote).toContain("8053672911039");
    expect(product.attributes.customAttributes).toMatchObject({ frameMaterial: "metal" });
  });

  it("withholds disputed Dior EPZ/1I colors while preserving source-supported construction and UV facts", () => {
    const attributes = customAttributes("noor-demo-007-dior-30montaigne-epz-1i");
    expect(attributes.frameMaterial).toBeNull();
    expect(attributes.frameMaterialDescription).toBe("plastic");
    expect(attributes.frameColor).toBeNull();
    expect(attributes.lensColor).toBeNull();
    expect(attributes.lensMaterial).toBe("plastic");
    expect(attributes.protectionLevel).toBe(3);
    expect(attributes.faceCompatibility).toBeNull();
    expect(attributes.sourceNote).toContain("30montaigne-epz-1i");
  });

  it("does not force OGA 8314O NN030 multi-valued material and shape facts into scalar ranking fields", () => {
    const attributes = customAttributes("noor-demo-009-oga-8314o-nn030");
    const product = productById("noor-demo-009-oga-8314o-nn030");
    expect(product.attributes.customAttributes).toMatchObject({ frameMaterial: null, gender: "unisex", frameShapes: [] });
    expect(attributes.frameMaterialComponents).toEqual(["acetate", "metal"]);
    expect(attributes.frameShapesSource).toEqual(["angular", "oval"]);
    expect(attributes.templeMaterial).toBeNull();
    expect(attributes.faceCompatibility).toBeNull();
    expect(attributes.sourceNote).toContain("NN030");
  });

  it("does not transfer shape/material from other Ray-Ban RB6461 color codes to 2500", () => {
    const attributes = customAttributes("noor-demo-010-ray-ban-rb6461-2500");
    const product = productById("noor-demo-010-ray-ban-rb6461-2500");
    expect(product.attributes.customAttributes).toMatchObject({ frameMaterial: null, frameShapes: [] });
    expect(attributes.lensWidthMm).toBe(51);
    expect(attributes.bridgeWidthMm).toBe(19);
    expect(attributes.templeLengthMm).toBe(145);
    expect(attributes.faceCompatibility).toBeNull();
    expect(attributes.sourceNote).toContain("RB6461 2500");
  });


  it("withholds Gucci GG0900S 005 shape, material, color, mirror and face-fit claims where exact-code sources disagree", () => {
    const attributes = customAttributes("noor-demo-008-gucci-gg0900s-005");
    expect(attributes.lensColor).toBe("yellow");
    expect(attributes.lensFeature).toBeNull();
    expect(attributes.faceCompatibility).toBeNull();
    expect(attributes.frameShapes).toEqual([]);
    expect(attributes.frameMaterial).toBeNull();
    expect(attributes.frameColor).toBeNull();
    expect(attributes.sourceNote).toContain("GG0900S 005");
  });

});
