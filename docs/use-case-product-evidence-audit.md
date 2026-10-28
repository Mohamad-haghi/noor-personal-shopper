# NOOR Demo — Use-Case Product Evidence Audit

**Status:** research gate; no ranking behavior changed  
**Catalog snapshot:** 15 demo products from `src/providers/demo/demo-catalog-seed.ts`  
**Purpose:** establish which product claims are safe to use for `everyday`, `driving_outdoors`, and `work_meetings` recommendations, while flagging catalog facts that need reconciliation.

## Decision

The current seed contains structured product facts (such as category, frame shape/material/color, UV protection, lens details and some dimensions), but it does not contain sourced product-level suitability for the three shopper use cases. Do not infer a positive use-case match from category, frame shape, gender, UV400, or generic marketing copy alone.

The feed exporter should only add a use-case suitability field after the team has defined a source-backed vocabulary and evidence format. Unknown must remain unknown; it must not be converted into a positive match or a negative claim.

This pass also found source/catalog discrepancies for some structured facts. Those must be reconciled against the exact product reference before being used as ranking signals. Do not silently rewrite seed values based on a merely similar SKU or model family.

## Evidence contract required before ranking

For each product/use-case assertion, retain:

- `useCase`: one canonical value: `everyday`, `driving_outdoors`, or `work_meetings`.
- `suitability`: `supported`, `not_supported`, or `unknown`. Use `unknown` when evidence is absent or ambiguous.
- `evidenceUrl`: source page for the exact product/SKU or manufacturer specification.
- `evidenceType`: e.g. `manufacturer_spec`, `manufacturer_guidance`, or `verified_editorial_review`.
- `evidenceNote`: concise claim actually supported by that source; do not turn broad style language into a performance claim.
- `checkedAt`: ISO date when the source was checked.

A source for a related color/size variant may corroborate model-family facts, but must not be treated as proof of the exact variant's lens, polarization, material, or other variant-specific property. Never claim that a product is safer for driving unless the evidence supports the relevant properties and the wording has been reviewed.

## Catalog review queue

All 15 records currently have **no explicit, source-backed use-case suitability field**. The table below is a verification queue, not a suitability classification.

| NOOR demo record | Model | Evidence status for use case |
|---|---|---|
| `noor-demo-001-ray-ban-rb3025-181-71` | Ray-Ban RB3025 181/71 | Unknown — exact color code found in a product listing; exact official spec needs confirmation |
| `noor-demo-002-persol-po0649-95-31` | Persol PO0649 95/31 | Unknown — official model/color page exists; no use-case claim established |
| `noor-demo-003-oakley-oo9318-02-34` | Oakley OO9318 02 34 | Unknown — exact SKU/source not yet verified |
| `noor-demo-004-tom-ford-ft0778-01a-60` | Tom Ford FT0778 01A 60 | Unknown — exact SKU/source not yet verified |
| `noor-demo-005-prada-pr03ys-2au6s1` | Prada PR03YS 2AU6S1 | Unknown — exact SKU source found; several seed attributes need reconciliation |
| `noor-demo-006-dolce-gabbana-dg2204-12988g-64` | Dolce & Gabbana DG2204 12988G 64 | Unknown — exact SKU source found; color, lens color and frame type/material need reconciliation |
| `noor-demo-007-dior-30montaigne-epz-1i` | Dior 30MONTAIGNE EPZ/1I | Unknown — exact SKU found at a retailer; manufacturer source still preferred |
| `noor-demo-008-gucci-gg0900s-005` | Gucci GG0900S 005 | Unknown — exact SKU/source not yet verified |
| `noor-demo-009-oga-8314o-nn030` | OGA 8314O NN030 | Unknown — exact SKU/source not yet verified |
| `noor-demo-010-ray-ban-rb6461-2500` | Ray-Ban RB6461 2500 | Unknown — exact SKU/source not yet verified |
| `noor-demo-011-tom-ford-ft5661-001` | Tom Ford FT5661 001 | Unknown — a close model/code match found; exact full SKU/size still needs confirmation |
| `noor-demo-012-prada-pr51yv-04q1o1` | Prada PR51YV 04Q1O1 | Unknown — exact SKU/source not yet verified |
| `noor-demo-013-valentino-va1021-3003` | Valentino VA1021 3003 | Unknown — exact SKU/source not yet verified |
| `noor-demo-014-cazal-607-001` | Cazal 607 001 | Unknown — official source confirms acetate/black; retailer source describes black/gold, so color presentation needs reconciliation |
| `noor-demo-015-persol-po3011-095` | Persol PO3011 095 | Unknown — exact SKU/source not yet verified |

## Source verification findings (checked 2026-10-28)

These checks establish only the specific facts stated below. They do **not** establish a product/use-case suitability label.

- **Ray-Ban RB3025 181/71:** [A product listing for the exact 181/71 color code](https://www.ray-ban.ru/product/ray-ban-aviator-rb3025-18171) confirms the model/color identifier. The previously found official Ray-Ban pages were other variants, so their lens, color, and size details must not be copied into this seed record without an exact match.
- **Persol PO0649 95/31:** [Persol official page](https://www.persol.com/de-de/products/0po0649-95_31) identifies the 649 Original with black frame and green lenses. The page supports model/color/lens-color identification, but does not establish a use-case recommendation. Do not infer polarization from a related PO0649 variant.
- **Prada PR03YS 2AU6S1:** [Retailer listing for the exact code](https://www.lensonlineshop.de/Prada-PR-03YS-2AU6S1.html) describes Havana/tortoise frame, brown gradient lenses, and plastic/metal frame components. The seed says frame material `nylon` and frame color `havana brown`, with gold temples. A second retailer describes the front as acetate and temples as metal ([Debenhams](https://www.debenhams.com/product/prada-fashion-tortoise-brown-gradient-pr03ys_p-4577cc8e-a058-4f33-a854-3aee5fd44338)). The color broadly aligns, but the single-value material field may be too coarse to represent a mixed-material frame; verify before changing it.
- **Dolce & Gabbana DG2204 12988G 64:** [Exact-code retailer listing](https://www.shadestation.co.uk/designer-sunglasses/Dolce---Gabbana/DG2204/DG2204-12988G-64) identifies pink-gold metal frame, light-grey gradient/black lens description, and size 64-14-140. The seed currently says gold, brown-gradient polycarbonate lenses, and `frameType: rimless`. These are potential mismatches; preserve the seed until the source feed and exact SKU are reconciled.
- **CAZAL 607 001:** [CAZAL official model page](https://www.cazal-eyewear.com/products/mod-607) lists variant 001 as black and frame material as acetate. A retailer listing for the same reference describes shiny black and gold with acetate ([Visionet](https://www.visio-net.com/eyeglasses/cazal-607-001.html)). Thus the seed's `gold + black` color may reflect retailer presentation, but its `nylon` material conflicts with both sources. Verify the exact product/reference before correction.
- **Tom Ford FT5661 001:** [Retailer listing](https://www.coolframes.com/glasses/tom-ford-italian-designer-eyewear/ft5661-b-n-mens-eyeglasses.html) identifies FT5661-B-N, color code 001, shiny black, plastic frame, and size 54-18-145. Since the seed's identifier is shortened to FT5661 001, treat this as a likely model-family match, not proof that every size/variant field is exact.
- **Dior 30MONTAIGNE EPZ/1I:** [Retailer listing](https://www.look-eyewear.com/product/show/2032) shows the exact model code and dimensions 58-15-135. This supports identity/dimensions only; it does not verify every seed attribute or use-case suitability.
- **Exact-variant caution:** search results for a model family can surface nearby colors, lens types, sizes, or suffixes. Unless the exact model/color code matches, treat variant-specific details as unverified.
- For the remaining 8 records, this pass did not establish a reliable exact-SKU source sufficient to change catalog facts. Their use-case suitability remains `unknown`; this is not a finding that they are unsuitable.

## Recommended implementation order

1. Reconcile the flagged product facts using the original feed/source record and exact SKU; add provenance to the catalog where practical.
2. Keep use-case suitability `unknown` unless evidence explicitly supports the assertion.
3. Validate the feed contract for canonical use-case vocabulary and evidence fields; reject malformed evidence.
4. Update COR's versioned Domain Pack only after NOOR's source fields are stable.
5. Test that a supported match affects ranking only when evidence exists, unknown earns no positive match, and hard constraints fail closed.
6. Re-run the independent catalog oracle and live deployment smoke tests before enabling the criterion in the demo.

**Scope:** documentation only. This audit does not change the live installation, credentials, Render configuration, catalog facts, or recommendation weights.
