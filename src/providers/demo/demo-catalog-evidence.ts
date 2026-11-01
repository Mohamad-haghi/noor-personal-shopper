/**
 * Field-level source ledger for the 15-item NOOR demo catalog.
 *
 * Status is deliberately conservative: "verified" means the cited exact-SKU
 * source supports this field; "conflict" means sources disagree; "unknown"
 * means the audit did not establish the field. A product-level source note
 * must never be interpreted as proof for every attribute on that product.
 *
 * Dates are audit capture dates, not claims about source publication dates.
 */
export type CatalogEvidenceStatus = "verified" | "unknown" | "conflict" | "derived";

export interface CatalogAttributeEvidence {
  readonly status: CatalogEvidenceStatus;
  readonly value?: string | number | boolean | readonly string[] | null;
  readonly normalizedValue?: string | readonly string[] | null;
  readonly sourceUrls: readonly string[];
  readonly sourceLabel: string;
  readonly capturedAt: string | null;
  readonly note?: string;
}

export interface ProductCatalogEvidence {
  readonly sku: string;
  readonly noorReference: string;
  readonly fields: Readonly<Record<string, CatalogAttributeEvidence>>;
}

const noor = "NOOR Optic";
const external = "Exact-SKU retailer/manufacturer sources";
const d = "2026-10-30";
const f = "2026-10-31";

const RAW_DEMO_CATALOG_ATTRIBUTE_EVIDENCE: Readonly<Record<string, ProductCatalogEvidence>> = {
  "1000053268": {
    sku: "RB3025 181/71", noorReference: "1000053268",
    fields: {
      frameShapes: { status: "verified", value: ["aviator"], normalizedValue: ["aviator"], sourceUrls: ["https://www.nooroptic.com/fa/ray-ban/28191-ray-ban-rb3025-18171-8053672495188.html"], sourceLabel: noor, capturedAt: d },
      frameMaterial: { status: "verified", value: "metal", normalizedValue: "metal", sourceUrls: ["https://www.nooroptic.com/fa/ray-ban/28191-ray-ban-rb3025-18171-8053672495188.html"], sourceLabel: noor, capturedAt: d },
      frameColor: { status: "verified", value: "gold", normalizedValue: "gold", sourceUrls: ["https://www.nooroptic.com/fa/ray-ban/28191-ray-ban-rb3025-18171-8053672495188.html"], sourceLabel: noor, capturedAt: d },
      faceCompatibility: { status: "verified", value: ["round", "oval", "heart", "rectangle"], normalizedValue: ["round", "oval", "heart", "rectangle"], sourceUrls: ["https://www.nooroptic.com/fa/ray-ban/28191-ray-ban-rb3025-18171-8053672495188.html"], sourceLabel: noor, capturedAt: d },
      uvProtection: { status: "verified", value: "UV400", normalizedValue: "UV400", sourceUrls: ["https://www.nooroptic.com/fa/ray-ban/28191-ray-ban-rb3025-18171-8053672495188.html"], sourceLabel: noor, capturedAt: d }
    }
  },
  "1000087540": {
    sku: "PO0649 95/31", noorReference: "1000087540",
    fields: {
      frameShapes: { status: "verified", value: ["aviator"], normalizedValue: ["aviator"], sourceUrls: ["https://www.nooroptic.com/fa/142/61980-persol-po0649-9531.html"], sourceLabel: noor, capturedAt: d },
      frameMaterial: { status: "conflict", value: "acetate", normalizedValue: "acetate", sourceUrls: ["https://www.nooroptic.com/fa/142/61980-persol-po0649-9531.html", "https://myluxottica-im.luxottica.com/Catalogue/PO_R3_2021_WW_324055.pdf"], sourceLabel: noor + " / Luxottica catalogue", capturedAt: d, note: "NOOR marketing text/category listing says nylon; structured product specification says acetate. Keep conflict visible." },
      frameColor: { status: "verified", value: "black", normalizedValue: "black", sourceUrls: ["https://www.nooroptic.com/fa/142/61980-persol-po0649-9531.html"], sourceLabel: noor, capturedAt: d },
      faceCompatibility: { status: "verified", value: ["oval", "heart", "round", "triangle", "rectangle"], normalizedValue: ["oval", "heart", "round", "triangle", "rectangle"], sourceUrls: ["https://www.nooroptic.com/fa/142/61980-persol-po0649-9531.html"], sourceLabel: noor, capturedAt: d }
    }
  },
  "1000088890": {
    sku: "OO9318 02 34", noorReference: "1000088890",
    fields: {
      frameShapes: { status: "conflict", sourceUrls: ["https://designerframesoutlet.com/oakley-sunglasses-oo9318?c=122283", "https://www.oakley.com/en-de/product/W0OO9318"], sourceLabel: external, capturedAt: d, note: "Exact -02 retailer calls it rectangular; Oakley family page describes shield. Do not transfer -07 facts." },
      frameMaterial: { status: "unknown", sourceUrls: ["https://www.oakley.com/en-de/product/W0OO9318"], sourceLabel: "Oakley family page", capturedAt: d, note: "O Matter is reported at family level for another color code; exact -02 taxonomy is unresolved." },
      frameColor: { status: "verified", value: "white", normalizedValue: "white", sourceUrls: ["https://designerframesoutlet.com/oakley-sunglasses-oo9318?c=122283"], sourceLabel: external, capturedAt: d },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000103998": {
    sku: "FT0778 01A 60", noorReference: "1000103998",
    fields: {
      frameShapes: { status: "verified", value: ["aviator"], normalizedValue: ["aviator"], sourceUrls: ["https://www.nooroptic.com/fa/tom-ford/78600-tom-ford-ft0778-01a-60.html"], sourceLabel: noor, capturedAt: d },
      frameMaterial: { status: "verified", value: "acetate", normalizedValue: "acetate", sourceUrls: ["https://www.nooroptic.com/fa/tom-ford/78600-tom-ford-ft0778-01a-60.html"], sourceLabel: noor, capturedAt: d },
      frameColor: { status: "verified", value: "black", normalizedValue: "black", sourceUrls: ["https://www.nooroptic.com/fa/tom-ford/78600-tom-ford-ft0778-01a-60.html"], sourceLabel: noor, capturedAt: d },
      faceCompatibility: { status: "verified", value: ["round", "oval", "heart", "rectangle", "triangle"], normalizedValue: ["round", "oval", "heart", "rectangle", "triangle"], sourceUrls: ["https://www.nooroptic.com/fa/tom-ford/78600-tom-ford-ft0778-01a-60.html"], sourceLabel: noor, capturedAt: d },
      uvProtection: { status: "verified", value: "UV400", normalizedValue: "UV400", sourceUrls: ["https://www.nooroptic.com/fa/tom-ford/78600-tom-ford-ft0778-01a-60.html"], sourceLabel: noor, capturedAt: d }
    }
  },
  "1000127057": {
    sku: "PR03YS 2AU6S1", noorReference: "1000127057",
    fields: {
      frameShapes: { status: "verified", value: ["butterfly"], normalizedValue: ["butterfly"], sourceUrls: ["https://www.lensonlineshop.de/Prada-PR-03YS-2AU6S1.html", "https://www.jomashop.com/prada-brown-gradient-butterfly-ladies-sunglasses-pr-03ys-2au6s1-53.html"], sourceLabel: external, capturedAt: f },
      frameMaterial: { status: "conflict", value: ["plastic", "metal"], normalizedValue: ["plastic", "metal"], sourceUrls: ["https://www.lensonlineshop.de/Prada-PR-03YS-2AU6S1.html", "https://www.jomashop.com/prada-brown-gradient-butterfly-ladies-sunglasses-pr-03ys-2au6s1-53.html"], sourceLabel: external, capturedAt: f, note: "Plastic front and metal temples; scalar frameMaterial is intentionally withheld." },
      frameColor: { status: "verified", value: "havana brown", normalizedValue: "havana brown", sourceUrls: ["https://www.lensonlineshop.de/Prada-PR-03YS-2AU6S1.html"], sourceLabel: external, capturedAt: f },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000084476": {
    sku: "DG2204 12988G 64", noorReference: "1000084476",
    fields: {
      frameMaterial: { status: "verified", value: "metal", normalizedValue: "metal", sourceUrls: ["https://www.shadestation.co.uk/designer-sunglasses/Dolce---Gabbana/DG2204/DG2204-12988G-64", "https://www.opticsplanet.com/dolce-gabbana-dg2204-sunglasses.html"], sourceLabel: external, capturedAt: f },
      frameColor: { status: "conflict", value: "gold", normalizedValue: "gold", sourceUrls: ["https://www.shadestation.co.uk/designer-sunglasses/Dolce---Gabbana/DG2204/DG2204-12988G-64", "https://www.opticsplanet.com/dolce-gabbana-dg2204-sunglasses.html"], sourceLabel: external, capturedAt: f, note: "Descriptions vary between pink-gold and gold; canonical gold retained with detail noted." },
      lensColor: { status: "verified", value: "grey", normalizedValue: "grey", sourceUrls: ["https://www.shadestation.co.uk/designer-sunglasses/Dolce---Gabbana/DG2204/DG2204-12988G-64", "https://www.opticsplanet.com/dolce-gabbana-dg2204-sunglasses.html"], sourceLabel: external, capturedAt: f },
      frameShapes: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000100480": {
    sku: "30MONTAIGNE EPZ/1I", noorReference: "1000100480",
    fields: {
      frameShapes: { status: "verified", value: ["square"], normalizedValue: ["square"], sourceUrls: ["https://www.alensa.hu/christian-dior-30montaigne-epz-1i", "https://www.ebay.com/p/19038022081"], sourceLabel: external, capturedAt: f, note: "Both exact-code sources support square; broader family descriptions are not substituted." },
      frameMaterial: { status: "verified", value: "plastic", normalizedValue: "plastic", sourceUrls: ["https://www.alensa.hu/christian-dior-30montaigne-epz-1i", "https://www.ebay.com/p/19038022081"], sourceLabel: external, capturedAt: f },
      frameColor: { status: "conflict", sourceUrls: ["https://www.alensa.hu/christian-dior-30montaigne-epz-1i", "https://www.ebay.com/p/19038022081"], sourceLabel: external, capturedAt: f, note: "Brown/havana vs yellow/red-havana conflict; value withheld." },
      lensColor: { status: "conflict", sourceUrls: ["https://www.alensa.hu/christian-dior-30montaigne-epz-1i", "https://www.ebay.com/p/19038022081"], sourceLabel: external, capturedAt: f, note: "Green vs grey conflict; value withheld." },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000104615": {
    sku: "GG0900S 005", noorReference: "1000104615",
    fields: {
      frameShapes: { status: "verified", value: ["square"], normalizedValue: ["square"], sourceUrls: ["https://www.glassesnow.co.uk/products/gucci-gg0900s-005", "https://www.visio-net.com/sunglasses/gucci-gg0900s-005.html"], sourceLabel: external, capturedAt: f },
      frameMaterial: { status: "conflict", sourceUrls: ["https://www.glassesnow.co.uk/products/gucci-gg0900s-005", "https://www.visio-net.com/sunglasses/gucci-gg0900s-005.html"], sourceLabel: external, capturedAt: f, note: "Acetate vs generic plastic wording; retain as unresolved taxonomy." },
      frameColor: { status: "conflict", sourceUrls: ["https://www.glassesnow.co.uk/products/gucci-gg0900s-005", "https://www.visio-net.com/sunglasses/gucci-gg0900s-005.html"], sourceLabel: external, capturedAt: f, note: "Black base is common; gold accent presence differs." },
      lensColor: { status: "verified", value: "yellow", normalizedValue: "yellow", sourceUrls: ["https://www.glassesnow.co.uk/products/gucci-gg0900s-005", "https://www.visio-net.com/sunglasses/gucci-gg0900s-005.html"], sourceLabel: external, capturedAt: f },
      lensFeature: { status: "conflict", sourceUrls: ["https://www.glassesnow.co.uk/products/gucci-gg0900s-005", "https://www.visio-net.com/sunglasses/gucci-gg0900s-005.html"], sourceLabel: external, capturedAt: f, note: "Mirror/silver coating differs; not asserted." },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000058221": {
    sku: "8314O NN030", noorReference: "1000058221",
    fields: {
      frameShapes: { status: "verified", value: ["angular", "oval"], normalizedValue: ["angular", "oval"], sourceUrls: ["https://top-brille.de/shop/oega-by-marius-morel-oega-8314o-nn030-brille-frame-lunettes-oga-2/"], sourceLabel: external, capturedAt: f, note: "Array retained; scalar COR shape is withheld until array contract support." },
      frameMaterial: { status: "verified", value: ["acetate", "metal"], normalizedValue: ["acetate", "metal"], sourceUrls: ["https://top-brille.de/shop/oega-by-marius-morel-oega-8314o-nn030-brille-frame-lunettes-oga-2/"], sourceLabel: external, capturedAt: f, note: "Array retained; scalar COR material is withheld until array contract support." },
      frameColor: { status: "verified", value: "black", normalizedValue: "black", sourceUrls: ["https://top-brille.de/shop/oega-by-marius-morel-oega-8314o-nn030-brille-frame-lunettes-oga-2/"], sourceLabel: external, capturedAt: f },
      gender: { status: "verified", value: "unisex", normalizedValue: "unisex", sourceUrls: ["https://top-brille.de/shop/oega-by-marius-morel-oega-8314o-nn030-brille-frame-lunettes-oga-2/"], sourceLabel: external, capturedAt: f },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000109052": {
    sku: "RB6461 2500", noorReference: "1000109052",
    fields: {
      frameShapes: { status: "conflict", sourceUrls: ["https://www.lojasrenner.com.br/p/oculos-de-grau-ray-ban-6461-2500-51/-/A-7010701524327-br.lr"], sourceLabel: external, capturedAt: d, note: "Exact listing prose says round; structured shape says square. Seed withholds shape." },
      frameMaterial: { status: "unknown", sourceUrls: ["https://www.lojasrenner.com.br/p/oculos-de-grau-ray-ban-6461-2500-51/-/A-7010701524327-br.lr"], sourceLabel: external, capturedAt: d, note: "Exact source does not settle frame/temple material." },
      frameColor: { status: "verified", value: "gold", normalizedValue: "gold", sourceUrls: ["https://www.lojasrenner.com.br/p/oculos-de-grau-ray-ban-6461-2500-51/-/A-7010701524327-br.lr"], sourceLabel: external, capturedAt: d },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000104076": {
    sku: "FT5661 001", noorReference: "1000104076",
    fields: {
      frameShapes: { status: "verified", value: ["square"], normalizedValue: ["square"], sourceUrls: ["https://pretavoir.co.uk/products/tom-ford-tf5661-b-001-blue-control", "https://visionsource-mountaineyecare.com/wp-content/uploads/sites/405/2020/04/Catalog_FT_USD.pdf"], sourceLabel: external, capturedAt: d },
      frameMaterial: { status: "verified", value: "acetate", normalizedValue: "acetate", sourceUrls: ["https://pretavoir.co.uk/products/tom-ford-tf5661-b-001-blue-control", "https://visionsource-mountaineyecare.com/wp-content/uploads/sites/405/2020/04/Catalog_FT_USD.pdf"], sourceLabel: external, capturedAt: d },
      frameColor: { status: "verified", value: "black", normalizedValue: "black", sourceUrls: ["https://pretavoir.co.uk/products/tom-ford-tf5661-b-001-blue-control"], sourceLabel: external, capturedAt: d },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000112234": {
    sku: "PR51YV 04Q1O1", noorReference: "1000112234",
    fields: {
      frameShapes: { status: "verified", value: ["rectangular"], normalizedValue: ["rectangular"], sourceUrls: ["https://eyerim.si/prada-pr51yv-04q1o1/"], sourceLabel: external, capturedAt: d },
      frameMaterial: { status: "verified", value: "titanium", normalizedValue: "titanium", sourceUrls: ["https://eyerim.si/prada-pr51yv-04q1o1/"], sourceLabel: external, capturedAt: d },
      frameColor: { status: "verified", value: "matte black", normalizedValue: "black", sourceUrls: ["https://eyerim.si/prada-pr51yv-04q1o1/"], sourceLabel: external, capturedAt: d },
      gender: { status: "conflict", value: "unisex", normalizedValue: "unisex", sourceUrls: ["https://eyerim.si/prada-pr51yv-04q1o1/"], sourceLabel: external, capturedAt: d, note: "Seed says unisex; exact retailer classifies as women's." },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000106967": {
    sku: "VA1021 3003", noorReference: "1000106967",
    fields: {
      frameShapes: { status: "conflict", sourceUrls: ["https://www.eye-shop.eu/sunglasses.asp?a_availab=2&a_ccode=%25&a_type=3&aprice=3&b_color=%25&b_diameter=%25&b_discount=1&b_lenscolor=%25&b_material=%25&b_model=%25&b_shape=%25&b_special=%25&b_style=%25&mypage=118&price=1-690&rel=next&t_ccode=1", "https://interoptika.ru/catalog/va-1021-3003/", "https://chrisoptics.com/products/valentino-va1021-3003-eyeglasses-pale-gold-oversized-metal-frame"], sourceLabel: external, capturedAt: f, note: "Exact 3003 sources differ: irregular vs round/geometric. Canonical shape and face fit withheld." },
      frameMaterial: { status: "verified", value: "metal", normalizedValue: "metal", sourceUrls: ["https://interoptika.ru/catalog/va-1021-3003/"], sourceLabel: external, capturedAt: f },
      frameColor: { status: "verified", value: "gold", normalizedValue: "gold", sourceUrls: ["https://interoptika.ru/catalog/va-1021-3003/"], sourceLabel: external, capturedAt: f },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000127106": {
    sku: "607 001", noorReference: "1000127106",
    fields: {
      frameShapes: { status: "verified", value: ["square"], normalizedValue: ["square"], sourceUrls: ["https://www.cazal-shop.jp/c/legends/607"], sourceLabel: "CAZAL official", capturedAt: f },
      frameMaterial: { status: "verified", value: ["acetate", "metal"], normalizedValue: ["acetate", "metal"], sourceUrls: ["https://www.cazal-shop.jp/c/legends/607"], sourceLabel: "CAZAL official", capturedAt: f, note: "Exact 607 001 material is a combination; scalar acetate seed is not the complete construction." },
      frameColor: { status: "verified", value: ["black", "gold"], normalizedValue: ["black", "gold"], sourceUrls: ["https://www.cazal-shop.jp/c/legends/607"], sourceLabel: "CAZAL official", capturedAt: f },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  },
  "1000044519": {
    sku: "PO3011 095", noorReference: "1000044519",
    fields: {
      frameMaterial: { status: "verified", value: "acetate", normalizedValue: "acetate", sourceUrls: ["https://www.nooroptic.com/fa/164-142"], sourceLabel: noor, capturedAt: d },
      gender: { status: "verified", value: "unisex", normalizedValue: "unisex", sourceUrls: ["https://www.nooroptic.com/fa/164-142"], sourceLabel: noor, capturedAt: d },
      lensColor: { status: "verified", value: "clear", normalizedValue: "clear", sourceUrls: ["https://www.nooroptic.com/fa/164-142"], sourceLabel: noor, capturedAt: d },
      frameShapes: { status: "unknown", sourceUrls: [], sourceLabel: "Exact detail page not retrieved", capturedAt: null },
      frameColor: { status: "unknown", sourceUrls: [], sourceLabel: "Exact detail page not retrieved", capturedAt: null },
      faceCompatibility: { status: "unknown", sourceUrls: [], sourceLabel: "Not established", capturedAt: null }
    }
  }
};


/** Every COR recommendation attribute receives an explicit evidence disposition. */
const REQUIRED_RECOMMENDATION_FIELDS = [
  "frameShapes",
  "frameMaterial",
  "frameColor",
  "faceCompatibility",
  "gender",
  "uvProtection",
] as const;

export const DEMO_CATALOG_ATTRIBUTE_EVIDENCE: Readonly<Record<string, ProductCatalogEvidence>> =
  Object.fromEntries(
    Object.entries(RAW_DEMO_CATALOG_ATTRIBUTE_EVIDENCE).map(([reference, record]) => [
      reference,
      {
        ...record,
        fields: Object.fromEntries(
          REQUIRED_RECOMMENDATION_FIELDS.map((field) => [
            field,
            record.fields[field] ?? {
              status: "unknown" as const,
              sourceUrls: [],
              sourceLabel: "Not established in the catalog audit",
              capturedAt: null,
            },
          ]),
        ),
      },
    ]),
  );


/**
 * Return a value only when its exact-SKU field evidence is verified and the
 * current scalar feed contract can represent it without information loss.
 * Multi-valued facts remain withheld until the array-valued feed contract is
 * implemented end-to-end (NOOR #52 + COR #268).
 */
export function verifiedCatalogScalar(
  evidence: ProductCatalogEvidence | null | undefined,
  field: string,
  rawValue: unknown,
): string | number | boolean | null {
  const fieldEvidence = evidence?.fields[field];
  if (!fieldEvidence || fieldEvidence.status !== "verified") return null;

  let candidate = rawValue;
  if (Array.isArray(candidate)) {
    if (candidate.length !== 1) return null;
    [candidate] = candidate;
  }
  if (typeof candidate !== "string" && typeof candidate !== "number" && typeof candidate !== "boolean") {
    return null;
  }

  let expected = fieldEvidence.normalizedValue ?? fieldEvidence.value;
  if (Array.isArray(expected)) {
    if (expected.length !== 1) return null;
    [expected] = expected;
  }
  if (expected !== undefined && expected !== null && expected !== candidate) return null;
  return candidate;
}
