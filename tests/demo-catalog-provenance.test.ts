import { describe, expect, it } from "vitest";
import { DEMO_CATALOG_SEED } from "../src/providers/demo/demo-catalog-seed";
import { DEMO_CATALOG_ATTRIBUTE_EVIDENCE } from "../src/providers/demo/demo-catalog-evidence";

describe("NOOR demo catalog field-level provenance", () => {
  it("covers all 15 exact demo references and attaches the same evidence to each seed product", () => {
    expect(DEMO_CATALOG_SEED.products).toHaveLength(15);
    expect(Object.keys(DEMO_CATALOG_ATTRIBUTE_EVIDENCE)).toHaveLength(15);

    for (const product of DEMO_CATALOG_SEED.products) {
      const custom = product.attributes.customAttributes as Record<string, unknown>;
      const reference = custom.noorReference as string;
      const evidence = DEMO_CATALOG_ATTRIBUTE_EVIDENCE[reference];

      expect(evidence, `missing evidence record for ${reference}`).toBeDefined();
      expect(evidence.noorReference).toBe(reference);
      expect(evidence.sku).toBe(product.externalIds.sku);
      expect(custom.catalogEvidence).toEqual(evidence);

      for (const [field, item] of Object.entries(evidence.fields)) {
        expect(["verified", "unknown", "conflict", "derived"]).toContain(item.status);
        expect(Array.isArray(item.sourceUrls)).toBe(true);
        if (item.status === "unknown") {
          // A URL/date may document an inspection that did not settle the field.
          if (item.sourceUrls.length === 0) expect(item.capturedAt).toBeNull();
          else expect(item.capturedAt).toMatch(/^2026-10-(30|31)$/);
        } else {
          expect(item.sourceUrls.length, `${reference}.${field} needs source URLs`).toBeGreaterThan(0);
          expect(item.capturedAt, `${reference}.${field} needs an audit capture date`).toMatch(/^2026-10-(30|31)$/);
        }
        if (item.status === "derived") {
          expect(item.note).toMatch(/rule/i);
        }
      }
    }
  });

  it("does not label the known conflict and unknown cases as verified", () => {
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000087540"].fields.frameMaterial.status).toBe("conflict");
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000106967"].fields.frameShapes.status).toBe("conflict");
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000109052"].fields.frameMaterial.status).toBe("unknown");
    expect(DEMO_CATALOG_ATTRIBUTE_EVIDENCE["1000100480"].fields.frameColor.status).toBe("conflict");
  });
});
