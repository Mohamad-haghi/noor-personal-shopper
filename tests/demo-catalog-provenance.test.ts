import { describe, expect, it } from "vitest";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";
import { DEMO_CATALOG_ATTRIBUTE_EVIDENCE, verifiedCatalogScalar } from "../src/providers/demo/demo-catalog-evidence";

describe("NOOR demo catalog field-level provenance", () => {
  it("covers all 15 exact demo references and attaches the same evidence to each seed product", () => {
    expect(DEMO_CATALOG_SEED.products).toHaveLength(15);
    const diorSeed = DEMO_CATALOG_SEED.products.find((item) => item.identity.id === "noor-demo-007-dior-30montaigne-epz-1i");
    const gucciSeed = DEMO_CATALOG_SEED.products.find((item) => item.identity.id === "noor-demo-008-gucci-gg0900s-005");
    expect((diorSeed!.attributes.customAttributes as Record<string, unknown>).frameShapes).toEqual(["square", "oval"]);
    expect((gucciSeed!.attributes.customAttributes as Record<string, unknown>).frameShapes).toEqual([]);
    expect((gucciSeed!.attributes.customAttributes as Record<string, unknown>).frameMaterial).toBeNull();
    expect((gucciSeed!.attributes.customAttributes as Record<string, unknown>).frameColor).toBeNull();
    expect(Object.keys(DEMO_CATALOG_ATTRIBUTE_EVIDENCE)).toHaveLength(15);

    for (const product of DEMO_CATALOG_SEED.products) {
      const custom = product.attributes.customAttributes as Record<string, unknown>;
      const reference = custom.noorReference as string;
      const evidence = DEMO_CATALOG_ATTRIBUTE_EVIDENCE[reference];

      expect(evidence, `missing evidence record for ${reference}`).toBeDefined();
      expect(evidence.noorReference).toBe(reference);
      expect(evidence.sku).toBe(product.externalIds.sku);
      expect(custom.catalogEvidence).toEqual(evidence);
      for (const requiredField of ["frameShapes", "frameMaterial", "frameColor", "faceCompatibility", "gender", "uvProtection"]) {
        expect(evidence.fields[requiredField], `${reference}.${requiredField} needs an explicit evidence status`).toBeDefined();
      }

      for (const [field, item] of Object.entries(evidence.fields)) {
        expect(["verified", "unknown", "conflict", "derived"]).toContain(item.status);
        expect(Array.isArray(item.sourceUrls)).toBe(true);
        if (item.status === "unknown") {
          // A URL/date may document an inspection that did not settle the field.
          if (item.sourceUrls.length === 0) expect(item.capturedAt).toBeNull();
          else expect(item.capturedAt).toMatch(/^(2026-10-(30|31)|2026-11-01)$/);
        } else {
          expect(item.sourceUrls.length, `${reference}.${field} needs source URLs`).toBeGreaterThan(0);
          expect(item.capturedAt, `${reference}.${field} needs an audit capture date`).toMatch(/^(2026-10-(30|31)|2026-11-01)$/);
        }
        if (item.status === "derived") {
          expect(item.note).toMatch(/rule/i);
        }
      }
    }
  });

  it("keeps every verified source value aligned with the exact seed field", () => {
    const seedByReference = new Map(
      DEMO_CATALOG_SEED.products.map((product) => {
        const custom = product.attributes.customAttributes as Record<string, unknown>;
        return [String(custom.noorReference), custom] as const;
      }),
    );

    for (const [reference, evidence] of Object.entries(DEMO_CATALOG_ATTRIBUTE_EVIDENCE)) {
      const custom = seedByReference.get(reference);
      expect(custom, `missing seed for evidence reference ${reference}`).toBeDefined();

      for (const [field, item] of Object.entries(evidence.fields)) {
        if (item.status !== "verified" || item.value === undefined) continue;

        const seedField =
          field === "frameMaterial" && Array.isArray(item.value) ? "frameMaterialComponents" :
          field === "frameColor" && Array.isArray(item.value) ? "frameColorComponents" :
          field === "frameShapes" && Array.isArray(item.value) && Array.isArray(custom?.frameShapesSource) ? "frameShapesSource" :
          field;
        expect(custom?.[seedField], `${reference}.${field} must match its captured source value`).toEqual(item.value);
      }
    }
  });

  it("exports only verified scalar facts supported by the current feed contract", () => {
    const rayBan = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000053268"];
    const persol = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000087540"];
    const cazal = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000127106"];
    const rb6461 = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000109052"];
    const oga = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000058221"];
    const prada = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000112234"];
    const dior = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000100480"];
    const gucci = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000104615"];
    const persolOptical = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000044519"];
    const dolceGabbana = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000084476"];
    const tomFordOptical = DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000104076"];
    expect(rayBan.fields.lensColor?.status).toBe("verified");
    expect(dolceGabbana.fields.lensMaterial?.status).toBe("verified");

    expect(verifiedCatalogScalar(rayBan, "frameShapes", ["aviator"])).toBe("aviator");
    expect(verifiedCatalogScalar(rayBan, "frameMaterial", "metal")).toBe("metal");
    const missingCapturedValue = {
      ...rayBan,
      fields: {
        ...rayBan.fields,
        frameMaterial: { ...rayBan.fields.frameMaterial, value: undefined },
      },
    };
    expect(verifiedCatalogScalar(missingCapturedValue, "frameMaterial", "metal")).toBeNull();
    expect(verifiedCatalogScalar(rayBan, "frameMaterial", "nylon")).toBeNull();
    expect(verifiedCatalogScalar(rayBan, "lensColor", "grey")).toBe("grey");
    expect(verifiedCatalogScalar(rayBan, "lensWidthMm", 62)).toBe(62);
    expect(verifiedCatalogScalar(rayBan, "bridgeWidthMm", 14)).toBe(14);
    expect(verifiedCatalogScalar(rayBan, "templeLengthMm", 140)).toBe(140);
    expect(verifiedCatalogScalar(rayBan, "faceCompatibility", ["round", "oval"])).toBeNull();
    expect(verifiedCatalogScalar(persol, "frameMaterial", "acetate")).toBe("acetate");
    expect(verifiedCatalogScalar(persol, "lensColor", "green")).toBe("green");
    expect(verifiedCatalogScalar(persol, "lensWidthMm", 54)).toBe(54);
    expect(verifiedCatalogScalar(cazal, "frameMaterial", ["acetate", "metal"])).toBeNull();
    expect(verifiedCatalogScalar(cazal, "frameMaterial", "acetate")).toBeNull();
    expect(verifiedCatalogScalar(cazal, "frameColor", null)).toBeNull();
    expect(verifiedCatalogScalar(cazal, "lensWidthMm", 56)).toBe(56);
    expect(verifiedCatalogScalar(rb6461, "frameMaterial", "nylon")).toBeNull();
    expect(verifiedCatalogScalar(oga, "frameShapes", ["angular", "oval"])).toBeNull();
    expect(verifiedCatalogScalar(prada, "frameColor", "matte black")).toBe("black");
    expect(verifiedCatalogScalar(dior, "frameShapes", ["square"])).toBeNull();
    expect(verifiedCatalogScalar(dior, "frameShapes", ["square", "oval"])).toBeNull();
    expect(verifiedCatalogScalar(dior, "frameMaterial", "plastic")).toBe("plastic");
    expect(verifiedCatalogScalar(gucci, "frameShapes", ["square"])).toBeNull();
    expect(verifiedCatalogScalar(persolOptical, "frameMaterial", "acetate")).toBe("acetate");
    expect(verifiedCatalogScalar(persolOptical, "frameColor", "black")).toBe("black");
    expect(verifiedCatalogScalar(persolOptical, "frameShapes", ["rectangular", "square", "wayfarer"])).toBeNull();
    expect(verifiedCatalogScalar(persolOptical, "faceCompatibility", ["round", "oval", "heart", "rectangle"])).toBeNull();
    expect(verifiedCatalogScalar(dolceGabbana, "frameColor", null)).toBeNull();
    expect(verifiedCatalogScalar(dolceGabbana, "lensColor", "grey")).toBe("grey");
    expect(verifiedCatalogScalar(dolceGabbana, "uvProtection", "UV400")).toBe("UV400");
    expect(verifiedCatalogScalar(dolceGabbana, "lensWidthMm", 64)).toBe(64);
    expect(verifiedCatalogScalar(prada, "lensWidthMm", 52)).toBe(52);
    expect(verifiedCatalogScalar(persolOptical, "lensWidthMm", 54)).toBe(54);
    expect(verifiedCatalogScalar(tomFordOptical, "lensWidthMm", 54)).toBeNull();
    expect(verifiedCatalogScalar(tomFordOptical, "frameShapes", ["square"])).toBeNull();
    expect(verifiedCatalogScalar(tomFordOptical, "frameMaterial", "acetate")).toBeNull();
    expect(verifiedCatalogScalar(tomFordOptical, "frameColor", "black")).toBeNull();
  });

  it("does not label the known conflict and unknown cases as verified", () => {
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000087540"].fields.frameMaterial.status).toBe("verified");
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000106967"].fields.frameShapes.status).toBe("conflict");
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000109052"].fields.frameMaterial.status).toBe("unknown");
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000100480"].fields.frameColor.status).toBe("conflict");
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000112234"].fields.frameShapes.status).toBe("conflict");
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000112234"].fields.gender.status).toBe("verified");
  });
});
