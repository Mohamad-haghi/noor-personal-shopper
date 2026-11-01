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

In this audit, face-compatibility values were directly confirmed on the exact NOOR Optic pages for products 1 (RB3025), 2 (PO0649) and 4 (FT0778). For the remaining products, the non-null seed faceCompatibility arrays were not independently verified against an accessible exact-SKU NOOR Optic page or manufacturer fit statement. Cazal 607 001 remains null, which is safer than inventing a value. Treat the other unverified arrays as `derived` or `unknown` until their source/rule is recorded; do not use them as unquestioned product facts in acceptance tests.

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


---

## Follow-up exact-SKU reconciliation — 2026-10-31

This follow-up does not rewrite the historical audit results above. It records a later evidence-backed correction proposal and separates remaining conflicts from resolved facts.

### Correction proposed on isolated PR #92 branch

**Product 13 — Valentino VA1021 3003 / NOOR reference `1000106967`**

- Seed previously declared frame shape `round`.
- Exact color-code 3003 listing at [eye-shop.eu](https://www.eye-shop.eu/sunglasses.asp?a_availab=2&a_ccode=%25&a_type=3&aprice=3&b_color=%25&b_diameter=%25&b_discount=1&b_lenscolor=%25&b_material=%25&b_model=%25&b_shape=%25&b_special=%25&b_style=%25&mypage=118&price=1-690&rel=next&t_ccode=1) identifies model 1021 / color 3003 / UPC 8056597334907 as **Irregular**, metal, pale gold.
- [Interoptika exact VA 1021 3003 page](https://interoptika.ru/catalog/va-1021-3003/) independently identifies the same 3003 code and reports a round/geometric shape, metal and gold.
- These two exact-code sources conflict on shape terminology (Irregular vs round/geometric). A third source [Chris Optics VA1021 3003](https://chrisoptics.com/products/valentino-va1021-3003-eyeglasses-pale-gold-oversized-metal-frame) describes an oversized round or irregular silhouette. **Do not promote either single normalized shape to verified yet.** The seed must not assert either normalized shape. The isolated correction branch now withholds the shape (`frameShapes: []`) and face compatibility (`null`) until the taxonomy conflict is resolved.

### Additional findings confirmed, but not yet changed

- **Gucci GG0900S 005:** exact-code retailer page reports black-and-gold frame, light-yellow lens with light-silver mirror, square/full-rim acetate. Seed currently stores black only and omits mirrored lens feature. This is a candidate correction, but requires a second exact-SKU source before editing.
- **OGA 8314O NN030:** exact-code page reports acetate + metal, angular + oval, black, unisex and 54-18-140. Seed's nylon/rectangular scalar fields cannot represent the multi-material/multi-shape source faithfully. Do not collapse these into one value; this depends on the array-valued catalog contract.
- **Prada PR03YS 2AU6S1:** exact code is corroborated for tortoise/butterfly/brown gradient and plastic frame; another exact-code listing describes acetate front with metal temples. Current seed's `nylon` is not supported as a precise taxonomy, but do not replace it with `acetate` until the frame-vs-temple distinction and canonical multi-material representation are settled.
- **D&G DG2204 12988G 64:** two exact-code retailer pages agree on light-grey gradient/black lens; frame color is described as pink-gold by one and gold by another. Lens color correction is strongly supported, but keep frame color unresolved pending a primary or additional exact source. Frame shape is not verified.
- **Ray-Ban RB6461 2500:** current official Ray-Ban RB6461 page found in follow-up is for **2943**, not 2500. It must not be used to change the seed's 2500 variant. The existing 2500 seed remains unresolved.
- **Valentino VA1021 3003:** exact-code sources agree pale-gold metal but conflict on round vs irregular shape; retain shape as disputed until a source-specific taxonomy decision is recorded.
- **Dior 30Montaigne EPZ/1I:** search results for other 30Montaigne codes (for example 807/1I) are not evidence for EPZ/1I. Keep EPZ/1I unresolved until exact-code evidence is available.

### Disposition

No live catalog, COR installation, Render service, Neon database, or deployed NOOR Pages data was changed. PR #92's isolated branch now explicitly withholds Valentino shape and face-compatibility values rather than selecting one disputed shape. This is a conservative candidate change, not a final verification. All unresolved facts remain non-authoritative for counselor-option generation and ranking.


### Additional exact-code cross-check — Valentino VA1021 3003 (2026-10-31)

A later retrieval found two more round descriptions for the exact VA1021 3003 color:
- Ottica Scauzillo's exact 3003 product page describes an oversized round metal frame in pale gold.
- Interoptika's exact 3003 page calls the shape round/geometric.
- In contrast, eye-shop's exact 3003 page labels it irregular.
- CoolFrames labels the VA1021 model family irregular, but its structured UPC details are for color 3002; 3003 is only included in the available color list.
- Selfridges describes the VA1021 model family as round metal, without exposing 3003 in the retrieved excerpt.

**Disposition unchanged:** the seed continues to withhold shape and face compatibility. The extra round descriptions strengthen that interpretation but do not eliminate the exact-variant taxonomy conflict. Do not select round or irregular until a documented normalization rule maps "round/geometric" vs "irregular" into the canonical shape vocabulary, ideally with visual review.


### Exact-SKU follow-up: additional catalog corrections and withheld fields (2026-10-31)

These findings were applied only to the isolated candidate seed branch for review; they are not merged or deployed.

- **Prada PR03YS 2AU6S1 / reference 1000127057:** exact-SKU sources identify plastic front/material with metal temples, tortoise frame and brown gradient lenses. The scalar `frameMaterial` is now withheld; raw material components are retained separately as `["plastic","metal"]`. Lens material is recorded as plastic. Sources: Lensonlineshop exact SKU page and Jomashop exact SKU / UPC 8056597515863.
- **D&G DG2204 12988G 64 / reference 1000084476:** Shade Station and OpticsPlanet identify manufacturer code 12988G-64 / UPC 8053672911039, pink-gold metal frame and light-grey gradient-to-black lenses. Candidate seed normalizes frame color to gold while retaining `frameColorDescription: "pink gold"`; lens color is grey and gradient is retained. Shape, face fit, rim type, lens material and prescription capability are not asserted.
- **Dior 30Montaigne EPZ/1I / reference 1000100480:** Alensa exact model page and eBay UPC 0716736291215 agree on plastic construction, square silhouette, gradient lens, UV400 and category 3; they disagree on frame and lens colors (brown/havana + green versus yellow/red-havana + grey). Candidate seed withholds disputed colors and face fit, retains square (common classification), records plastic lens material and source-described plastic frame material separately.
- **ÖGA 8314O NN030 / reference 1000058221:** exact NN030 listing reports acetate + metal, angular + oval, black, unisex, 54-18-140. Candidate seed corrects gender to unisex, removes unsupported scalar nylon/rectangular ranking values, retains raw material/shape components in separate evidence fields, and withholds face fit. Array-valued fields must not be used for COR ranking until COR #268 / NOOR #52 contract support is implemented.
- **Ray-Ban RB6461 2500 / reference 1000109052:** exact 2500 listing confirms optical type, gold finish and 51-19-145 dimensions. It does not confirm frame shape or material. Candidate seed withholds the previously asserted round/metal/nylon material and face-fit values; other RB6461 color codes are not transferred.
- **Gucci GG0900S 005 / reference 1000104615:** two exact-code listings agree yellow lens and black base frame but differ on gold accents and silver mirror; acetate versus generic plastic wording also differs. Candidate seed retains square and yellow, but withholds mirror feature and face fit and records the discrepancy.

Regression assertions were added for each candidate disposition. These changes remain pending current-head CI. They do not authorize a merge or Pages deployment.


---

## Independent source cross-check — 2026-11-01

This section records a second-pass retrieval against exact product pages after the original 2026-10-30 audit. It supplements the historical audit above; it does not silently rewrite the original findings.

### Confirmed evidence refinements

- **Persol PO3011 095 / NOOR reference `1000044519`:** the exact detail page is now retrievable at https://www.nooroptic.com/fa/142/19456-persol-po3011-095.html. It explicitly identifies reference 1000044519 and confirms optical type, male + female (normalized as unisex), rectangular + square + wayfarer shapes, acetate frame and temples, black frame, clear lenses, and face suitability for round, oval, heart and rectangle. The candidate evidence ledger now records these exact facts with capture date 2026-11-01. Shape and face suitability are multi-valued and are withheld from the current scalar COR feed until the array contract is supported.
- **Dior 30Montaigne EPZ/1I / reference `1000100480`:** the exact Alensa page lists square **and oval** shapes; eBay lists square. The candidate seed and ledger now preserve `["square","oval"]` rather than flattening the evidence to square. The scalar feed gate therefore withholds shape. Frame/lens color conflicts remain unresolved.
- **Gucci GG0900S 005 / reference `1000104615`:** a third exact-code listing (Jomashop, model GG0900S 005) describes wrap/shield, while GlassesNow describes square. The evidence ledger now marks shape as conflict and adds the Jomashop URL. The candidate seed no longer asserts a shape, scalar frame material or scalar frame color for this SKU. Yellow lens remains supported; mirror and face fit remain withheld.

### Reconfirmed dispositions

- **Persol PO0649 95/31:** exact NOOR detail page has a marketing description using “nylon” but its structured specification says acetate. Keep the source conflict explicit; do not silently select a scalar material.
- **Ray-Ban RB3025 181/71:** exact NOOR page confirms aviator, metal, gold, UV400 and the listed face-shape suitability.
- **Valentino VA1021 3003:** Interoptika exact 3003 page says round/geometric, while eye-shop exact 3003 says irregular. Keep shape withheld.
- **OGA 8314O NN030 and CAZAL 607 001:** exact sources support multi-material constructions; retain arrays and do not flatten them to scalar material.
- **Prada PR51YV 04Q1O1:** exact Eyerim page confirms rectangular, titanium and matte black, but classifies the model as women's; the candidate seed's unisex claim remains a conflict and is withheld.

### Candidate implementation / validation status

NOOR PR #92 contains these corrections on its isolated branch only. Current branch head: `e4fde6fed7ce9df8de30091477c31919a2ecde69`. The latest Build Verification known to pass is run #819 on the previous head `3016d5831b9bb960055634659a81780d7cc31c61`; it is **not** proof for the new source-review commits. No workflow run is currently visible for the new head. The connected GitHub Actions interface in this session does not expose workflow dispatch, so exact-head CI remains pending.

No PR was merged, no Pages deployment occurred, and no live COR installation, Render, Neon or Clerk state was changed. Stage 1 remains open until exact-head CI and independent reviewer acceptance.


### CI follow-up after the source-review correction — 2026-11-01

Build Verification run #823 executed on NOOR code head `e4fde6fed7ce9df8de30091477c31919a2ecde69`. The isolated behavioral-test job failed on one stale assertion in `tests/demo-catalog-evidence.test.ts`: it still expected Gucci GG0900S 005 to retain `["square"]`, while the source-review correction correctly changed the seed to an empty shape list. Result before the fix: 34/35 test files and 139/140 tests passed; type-check/build were skipped after the test failure.

The stale test was corrected to expect the evidence-safe state (empty shape, null scalar material and frame color) and to describe the complete withheld-field policy. Fix commit/current code head: `eedfd74a4bf5de2e82f0f91f13bf71d3fac92828`. No workflow run is currently visible for this new head, so exact-head CI remains pending. Do not treat run #823 as a passing validation or the build step as executed.


### Exact-head Build Verification passed — 2026-11-01

NOOR Build Verification [#825](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41268963070) passed on exact code candidate head `eedfd74a4bf5de2e82f0f91f13bf71d3fac92828`: 35/35 test files, 140/140 tests, TypeScript and Vite build. The live UI/COR handoff job was skipped by design. This resolves the stale assertion failure from #823 on the prior head. Independent reviewer acceptance and visual evidence remain open; no merge or deployment is authorized.


## Second-pass exact-source reconciliation — additional records — 2026-11-01

This supplement records additional source checks against exact model/color codes. It preserves unresolved disagreements instead of selecting a convenient scalar.

### Ray-Ban RB3025 181/71 — NOOR reference `1000053268`

Ray-Ban's official exact-code page identifies `RB3025 181/71 58-14`, metal frame, polished Arista gold, grey gradient lenses, category 3N, and 135 mm temples: https://www.ray-ban.com/usa/sunglasses/RB3025%20MALE%20117-aviator%20classic-gold/8053672495171. It calls the frame shape "Pilot"; NOOR's exact product title/specification uses "Aviator". The candidate ledger retains canonical demo label `aviator` and records the official shape synonym explicitly. The previously withheld feed `lensColor` is now source-verified as canonical `grey`; gradient remains a separate descriptive feature and is not collapsed into color.

### CAZAL 607 001 — NOOR reference `1000127106`

The manufacturer model page lists variant 001 as black and identifies acetate material: https://www.cazal-eyewear.com/products/mod-607-3. An exact-variant retailer lists 607 001 as black, plastic + alloy, square, 56/18 and 140 mm temples, and describes the construction as black acetate plus gold metal: https://www.cazal-shop.jp/c/legends/607. The seed no longer asserts scalar `frameMaterial`, `frameColor`, or `templeMaterial`; it retains component arrays for acetate/metal and black/gold. These arrays are not flattened into the current scalar COR mapping.

### Dolce & Gabbana DG2204 12988G 64 — NOOR reference `1000084476`

Exact UPC 8053672911039 sources Shade Station and OpticsPlanet identify a pink-gold metal frame and light-grey gradient-to-black lenses. Lentekontakti's exact model page instead describes a gold frame, grey lens, plastic lens material and UV400: https://www.lentekontakti.com/dolce-gabbana-dg2204-12988g. The evidence ledger now preserves the gold vs pink-gold conflict without a scalar frame color; the seed stores the competing descriptions rather than selecting gold. Grey lens color and UV400 remain source-verified; lens material is recorded as plastic from the Lentekontakti listing. Shape, fit and rim type remain unknown.

### Prada PR03YS 2AU6S1

Lensonlineshop's exact SKU page lists Havana/tortoise color, brown gradient lenses, plastic front / metal temples, and women's category: https://www.lensonlineshop.de/Prada-PR-03YS-2AU6S1.html. Debenhams independently identifies the same exact code and MPN `M8056597515863`, describing acetate front with metal temples: https://www.debenhams.com/product/prada-fashion-tortoise-brown-gradient-pr03ys_p-4577cc8e-a058-4f33-a854-3aee5fd44338. Seed keeps material components and does not force a scalar frame material. The exact source pages support a women's classification; retain the seed's existing female value.

### Tom Ford FT5661 001

The Tom Ford catalogue PDF distinguishes `FT5661-B` and `FT5661-B-N`; for `FT5661-B-N`, color 001 is shiny black / gunmetal temple / blue-block lens and the listed size includes 54-18-145: https://drmah.ca/wp-content/uploads/2020/05/Tom-Ford.pdf. This is model-family evidence, not sufficient to equate every retailer's `FT5661 001` with the exact NOOR variant. Keep exact-SKU uncertainty explicit until the NOOR reference is matched to the `-B-N` suffix and size.

### Candidate implementation disposition

On NOOR PR #92, current candidate seed changes now withhold CAZAL's composite frame facts and D&G's disputed frame color; verified D&G lens/UV facts are recorded, and Ray-Ban's exact official source supports grey lens color. Prada mixed construction remains componentized. New regression assertions cover these changes. Current candidate code head: `4cab726ab66d5e0abd7e9bbcdc7e4baf80575e6e`. Exact-head CI is not yet visible; previous Build Verification #825 is for the prior head and must not be reused. PR remains Draft/unmerged.


### Provenance projection defect found during CI review — 2026-11-01

Build Verification #833 (https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41269364356) failed because the exported `DEMO_CATALOG_ATTRIBUTE_EVIDENCE` projection rebuilt each record using only the six required ranking fields. That unintentionally discarded supplemental, explicitly recorded fields such as `lensColor` and `lensMaterial`; the new exact Ray-Ban lens-color test correctly exposed this.

The projection now spreads all original `record.fields` first, then fills any missing required ranking fields with explicit `unknown` records. This preserves supplemental provenance while retaining mandatory coverage for every ranking attribute. A regression assertion now checks that RB3025 lensColor and DG2204 lensMaterial evidence survive the projection. The stale #833 failure is not treated as a pass; exact-head CI for the correction is pending.

Current code candidate head: `a48579175aac7400e6532aedd6a578873c5cb455`.


### Exact-head validation for evidence-map preservation — 2026-11-01

NOOR Build Verification [#836](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41269439640) passed on candidate head `a48579175aac7400e6532aedd6a578873c5cb455`: 35/35 test files, 140/140 tests, TypeScript and Vite build. The live UI/COR handoff job was skipped by design. This confirms the supplemental evidence-field preservation fix; it does not validate subsequent FT5661 / PR51YV / lens-width changes now being developed.


### CI follow-up for exact RB3025 size correction — 2026-11-01

Build Verification #845 (https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41269578922) failed one stale test assertion: the seed source note no longer says the width was retained from the old seed; it now records the official 58-14 size code and clarifies that 50.1 mm is lens height. The code change was correct; only the old wording assertion was stale. Updated the test to expect the corrected note. Fix commit: `f5791bfb46da70b0bdc050708ec43faa9512ec56`. Exact-head CI is pending.


### Persol PO0649 95/31 — exact manufacturer source resolves material conflict — 2026-11-01

Persol's official exact-variant page for `0PO0649-95/31` explicitly identifies a black acetate frame, green crystal lenses, model code PO0649 and 54 mm lens width: https://www.persol.com/en-us/products/0po0649-95_31. This resolves the generic "nylon" marketing wording on the NOOR product page in favor of the manufacturer's structured specification. The candidate evidence ledger now marks frame material verified as acetate, and source-verifies green lens color and 54 mm width. The existing face-fit list remains a separate product-level assertion and is not derived from the style or material evidence.
