# NOOR 15-Product Demo Catalog — Source and Attribute Audit
**Audit date:** 2026-10-30  
**Audited source revision:** NOOR `main` at `d58ba221122b9124460cd17c267ead53abaaac2c`  
**Catalog source website identified:** [nooroptic.com](https://www.nooroptic.com/)  
**Scope:** read-only source comparison. No product data or application code was changed.

## Executive result

The 15-product demo catalog is based on real eyewear model identifiers and the source website is confirmed as NOOR Optic. However, the current public website and external exact-SKU evidence do not support treating every seed attribute as verified.

- **3 exact NOOR Optic product pages** were inspected in detail: Ray-Ban RB3025 181/71, Persol PO0649 95/31, Tom Ford FT0778 01A 60.
- **2 additional exact NOOR Optic product listings** were located: Valentino VA1021 3003 and Persol PO3011 095.
- The current NOOR Optic Cazal listing exposes **607/3 001**, not the seed's **607 001**; these must not be conflated.
- The current Prada listing shows **PR03YS 1AB0A7** and **PR24XS 2AU6S1**, while an external exact-SKU page exists for **PR03YS 2AU6S1**. This needs reconciliation with the captured historical reference.
- Exact external sources reveal several important differences: D&G lens color, Dior lens color/category, Gucci frame/lens detail, OGA material/shape, Ray-Ban RB6461 shape/temple material, Valentino shape, and Cazal material.
- The current site pages have different crawl ages (some 8–18 months old). They prove model/attribute records existed, not current inventory or current availability.

**Important:** this is a source audit, not permission to change the seed. Keep every disputed value unchanged until the exact source record and mapping decision are reviewed.

## Source status vocabulary

- **Exact page:** exact model and color/SKU page on NOOR Optic, with structured attributes.
- **Exact listing:** exact model/SKU appears in a NOOR Optic brand/category list, but the full product page could not be retrieved.
- **External exact SKU:** exact SKU found on a manufacturer/retailer source, but current NOOR Optic product page was not verified.
- **Conflict:** source facts disagree with the seed or the exact model/color pairing is inconsistent.
- **Unverified:** no reliable exact-variant evidence found in this audit.

## Product-by-product audit

| # | Seed model / reference | NOOR Optic evidence | External exact-SKU evidence | Assessment of seed fields used by COR |
|---:|---|---|---|---|
| 1 | Ray-Ban RB3025 181/71 / `1000053268` | [Exact product page](https://www.nooroptic.com/fa/ray-ban/28191-ray-ban-rb3025-18171-8053672495188.html) | Manufacturer family evidence also supports Aviator/metal/gold | **Verified.** NOOR page confirms aviator, metal, gold, gradient smoky crystal lens, UV400, category 3, non-polarized and face shapes. Seed's key COR fields match. |
| 2 | Persol PO0649 95/31 / `1000087540` | [Exact product page](https://www.nooroptic.com/fa/142/61980-persol-po0649-9531.html) | [Luxottica/Persol catalogue](https://myluxottica-im.luxottica.com/Catalogue/PO_R3_2021_WW_324055.pdf) includes 95/31 variant | **Verified with a source-note conflict.** The NOOR category listing and marketing description call the frame nylon; the product-detail structured specification says acetate. Seed preserves the structured acetate value and records the conflict; this must remain a documented source conflict rather than silently choosing one taxonomy. The NOOR page confirms aviator, black, green crystal lens, category 3, UV400 and the five face shapes. |
| 3 | Oakley OO9318 02 34 / `1000088890` | Exact NOOR Optic page not located in the accessible listing snapshot | [Exact OO9318-02 retailer listing](https://designerframesoutlet.com/oakley-sunglasses-oo9318?c=122283) identifies Matte White; [Oakley OO9318 family page](https://www.oakley.com/en-de/product/W0OO9318) describes Trillbe/O Matter/Shield for variant -07 | **Conflict / partial.** Exact -02 is a white Trillbe variant. The seed's white color is plausible; "nylon" needs taxonomy clarification against Oakley's O Matter, and shape labels differ across retailer taxonomy (rectangular) and Oakley's family description (shield). Do not transfer -07's lens/material specifics to -02 without variant evidence. |
| 4 | Tom Ford FT0778 01A 60 / `1000103998` | [Exact product page](https://www.nooroptic.com/fa/tom-ford/78600-tom-ford-ft0778-01a-60.html) | Retailer exact page corroborates acetate/black/aviator | **Verified.** NOOR page confirms aviator, acetate front, titanium temples, black/gold, smoky nylon lens, category 3, UV400, non-polarized and face compatibility. Seed matches these fields. |
| 5 | Prada PR03YS 2AU6S1 / `1000127057` | Current [Prada brand listing](https://www.nooroptic.com/fa/212_prada) shows PR03YS 1AB0A7 and PR24XS 2AU6S1, not this exact pairing | [Exact PR03YS 2AU6S1 retailer page](https://www.lensonlineshop.de/Prada-PR-03YS-2AU6S1.html) confirms tortoise, plastic/metal, brown gradient lens | **Conflict requiring historical-source reconciliation.** External evidence supports the exact model/color pairing in the seed, but current NOOR listing splits the model and color across two different product codes. Seed's nylon frame category is less precise than plastic/metal. Do not rewrite from the current list alone. |
| 6 | Dolce & Gabbana DG2204 12988G 64 / `1000084476` | NOOR brand page was not retrievable in this audit | [Exact SKU page](https://www.shadestation.co.uk/designer-sunglasses/Dolce---Gabbana/DG2204/DG2204-12988G-64) | **Conflict.** Exact SKU is pink-gold metal with light-grey gradient/black lenses. Seed says gold metal and brown two-tone lenses; lens color is not supported and should be corrected only after a second source review. Frame-shape claim remains unverified for this exact SKU. |
| 7 | Dior 30Montaigne EPZ/1I / `1000100480` | NOOR Dior brand page returned a gateway error; exact NOOR product page not verified | [Exact EPZ/1I retailer page](https://www.alensa.hu/christian-dior-30montaigne-epz-1i) | **Conflict / partial.** External exact variant describes square/oval/oversize, havana/brown frame, black+gold temples, green gradient lenses, plastic material, UV400 and category 3. Seed has square/havana but smoky lens, gold-only temple color and category 2. Lens color/category need correction after source confirmation. |
| 8 | Gucci GG0900S 005 / `1000104615` | Exact NOOR product page not located | [Exact SKU page](https://www.glassesnow.co.uk/products/gucci-gg0900s-005) | **Partial.** Exact SKU is square, full-rim acetate, black-and-gold frame, yellow lens with light-silver mirror. Seed's square/acetate/black/yellow broadly matches, but it omits gold in frame color and the mirror lens feature. |
| 9 | OGA 8314O NN030 / `1000058221` | Exact NOOR product page not located | [Exact SKU page](https://top-brille.de/shop/oega-by-marius-morel-oega-8314o-nn030-brille-frame-lunettes-oga-2/) | **Conflict.** Exact SKU is acetate+metal, unisex, black, angular/oval, 54-18-140. Seed says nylon and rectangular; those values are not supported by the exact external SKU page. |
| 10 | Ray-Ban RB6461 2500 / `1000109052` | Exact NOOR listing not located in the first accessible Ray-Ban page snapshot | [Exact SKU retailer page](https://www.lojasrenner.com.br/p/oculos-de-grau-ray-ban-6461-2500-51/-/A-7010701524327-br.lr) | **Conflict / uncertainty.** Exact source's prose calls the design round, but its structured frame-shape field says square; it confirms gold metal. The page describes PEEK temples, not nylon. Keep shape/temple material unknown until a manufacturer exact-variant record resolves the conflict. |
| 11 | Tom Ford FT5661 001 / `1000104076` | Exact NOOR product page not found in the first accessible Tom Ford listing page | [Exact model/colour retailer page](https://pretavoir.co.uk/products/tom-ford-tf5661-b-001-blue-control); [Tom Ford catalogue PDF](https://visionsource-mountaineyecare.com/wp-content/uploads/sites/405/2020/04/Catalog_FT_USD.pdf) | **Verified for key fields.** Exact FT5661-B 001 is square/full-rim/black/acetate. The catalogue confirms acetate front and temples. Seed's square/acetate/black is supported. |
| 12 | Prada PR51YV 04Q1O1 / `1000112234` | Exact NOOR product page not found in the first accessible Prada listing page | [Exact SKU page](https://eyerim.si/prada-pr51yv-04q1o1/) | **Partial / gender conflict.** Exact SKU is rectangular, titanium, matte black, full-rim; seed matches those COR fields. Retailer classifies it as women's, while seed says unisex. Resolve gender policy before treating that field as verified. |
| 13 | Valentino VA1021 3003 / `1000106967` | [Exact SKU appears in NOOR Valentino listing](https://www.nooroptic.com/fa/207-192); product-detail URL was cache-missed | [Exact model/color retailer page](https://www.coolframes.com/glasses/valentino-designer-eyewear/va1021-eyeglasses.html) | **Partial.** NOOR's exact listing includes VA1021 3003; the independent retailer confirms 3003 is pale gold and the model is metal construction / ladies full-frame. The available exact source does not establish frame shape. Seed's `round` value is therefore unverified, not yet disproven; obtain the exact NOOR detail page or manufacturer record before changing it. |
| 14 | Cazal 607 001 / `1000127106` | Current [NOOR Cazal listing](https://www.nooroptic.com/fa/315-cazal) shows 607/3 001 and 607/2/3 001, not the seed's exact 607 001. [607/3 detail](https://www.nooroptic.com/fa/cazal/32511-cazal-6073-001-4251386502954.html) has a different NOOR reference (`1000057589`). | [Exact Cazal 607 001 page](https://www.cazal-shop.jp/c/legends/607) | **Conflict.** Exact 607 001 is square and plastic/acetate plus alloy/metal, black with gold details. Seed says nylon and gold+black. Do not substitute NOOR's 607/3 001 attributes; they are a different SKU. Face compatibility remains unknown, which is correct. |
| 15 | Persol PO3011 095 / `1000044519` | [Exact SKU appears in NOOR Persol listing](https://www.nooroptic.com/fa/164-142); the detail URL was not retrievable in this audit | Exact variant detail not independently verified | **Partial.** NOOR listing identifies PO3011 095, both genders, acetate/kautchuk frame and clear lens. Seed's model, unisex, acetate and clear-lens values align; frame color, shape, dimensions and faceCompatibility still need the exact product page or historical capture. |

## Important source-level findings

### 1. The NOOR website is a useful source, but page crawl age matters

The public sunglasses category currently reports 2,769 products and exposes structured filters for frame shape, frame color (including white), frame material (including titanium and acetate), lens material, lens feature, polarization and face suitability: [NOOR Optic sunglasses category](https://www.nooroptic.com/fa/12-sunglasses).

The audited product pages have different crawl ages (for example, the Ray-Ban page was crawled last year, the Persol page about eight months ago, and Tom Ford about 1.5 years ago). These pages establish the captured product facts, not live stock or current availability. Do not use the current website's availability as the demo feed's inventory.

### 2. Source provenance is not carried end-to-end

The seed stores a `noorReference` and sometimes a free-text `sourceNote`, but does not persist a source URL and capture timestamp for every field. The current feed exporter does not carry `sourceNote` into the public feed. Therefore COR cannot trace a scored product attribute back to a page or distinguish a source fact from a derived value.

### 3. Derived face compatibility needs its own provenance

NOOR Optic product pages sometimes explicitly list face suitability and provide a face-fit explanation. When that field is present, preserve the source list and the capture date. If a future value is inferred from shape rather than copied from the page, label it `derived`, record the rule/version and do not represent it as a manufacturer fact.

### 4. The correct demo acceptance boundary

- Test COR only against verified values present in the 15-product feed.
- A missing or conflicting field is `unknown`, not a mismatch and not a fabricated value.
- Mandatory constraints must be evaluated only when the exact attribute is available and source-verified.
- Do not claim driving/outdoors affects the score while `useCase` remains context-only.
- Do not treat a normalized COR match score as a probability of product suitability.
- The 15-item demo feed remains a small historical sample, not a complete or live copy of NOOR's 2,769-product store.

## Recommended data schema before any seed correction

For each product attribute used by COR, retain:

- `value` and `normalizedValue`
- `sourceUrl`
- `sourceLabel` (NOOR Optic, manufacturer, authorized retailer, derived rule)
- `capturedAt`
- `verificationStatus` (`verified`, `unknown`, `conflict`, `derived`)
- `variantCode` / exact SKU
- `derivationRuleVersion` only when derived

This audit does not implement that schema or alter any seed values. It creates the evidence baseline for the next approved test/fix round.
