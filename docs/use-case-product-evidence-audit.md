# NOOR Demo — Use-Case Product Evidence Audit

**Status:** research gate; no ranking behavior changed  
**Catalog snapshot:** 15 demo products from `src/providers/demo/demo-catalog-seed.ts`  
**Purpose:** establish which product claims are safe to use for `everyday`, `driving_outdoors`, and `work_meetings` recommendations.

## Decision

The current seed contains structured product facts (such as category, frame shape/material/color, UV protection, lens details and some dimensions), but it does not contain sourced product-level suitability for the three shopper use cases. Do not infer a positive use-case match from category, frame shape, gender, UV400, or generic marketing copy alone.

The feed exporter should only add a use-case suitability field after the team has defined a source-backed vocabulary and evidence format. Unknown must remain unknown; it must not be converted into a positive match or a negative claim.

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
| `noor-demo-001-ray-ban-rb3025-181-71` | Ray-Ban RB3025 181/71 | Unknown — product facts partly verified; no use-case claim established |
| `noor-demo-002-persol-po0649-95-31` | Persol PO0649 95/31 | Unknown — official model/color page exists; no use-case claim established |
| `noor-demo-003-oakley-oo9318-02-34` | Oakley OO9318 02 34 | Unknown — exact SKU/source not yet verified |
| `noor-demo-004-tom-ford-ft0778-01a-60` | Tom Ford FT0778 01A 60 | Unknown — exact SKU/source not yet verified |
| `noor-demo-005-prada-pr03ys-2au6s1` | Prada PR03YS 2AU6S1 | Unknown — exact SKU/source not yet verified |
| `noor-demo-006-dolce-gabbana-dg2204-12988g-64` | Dolce & Gabbana DG2204 12988G 64 | Unknown — exact SKU/source not yet verified |
| `noor-demo-007-dior-30montaigne-epz-1i` | Dior 30MONTAIGNE EPZ/1I | Unknown — exact SKU/source not yet verified |
| `noor-demo-008-gucci-gg0900s-005` | Gucci GG0900S 005 | Unknown — exact SKU/source not yet verified |
| `noor-demo-009-oga-8314o-nn030` | OGA 8314O NN030 | Unknown — exact SKU/source not yet verified |
| `noor-demo-010-ray-ban-rb6461-2500` | Ray-Ban RB6461 2500 | Unknown — exact SKU/source not yet verified |
| `noor-demo-011-tom-ford-ft5661-001` | Tom Ford FT5661 001 | Unknown — exact SKU/source not yet verified |
| `noor-demo-012-prada-pr51yv-04q1o1` | Prada PR51YV 04Q1O1 | Unknown — exact SKU/source not yet verified |
| `noor-demo-013-valentino-va1021-3003` | Valentino VA1021 3003 | Unknown — exact SKU/source not yet verified |
| `noor-demo-014-cazal-607-001` | Cazal 607 001 | Unknown — official model page exposes a material/color discrepancy with seed; needs reconciliation |
| `noor-demo-015-persol-po3011-095` | Persol PO3011 095 | Unknown — exact SKU/source not yet verified |

## Source verification findings (checked 2026-10-28)

These checks establish only the specific facts stated below. They do **not** establish a product/use-case suitability label.

- **Ray-Ban RB3025 181/71:** [Ray-Ban official product page](https://www.ray-ban.com/usa/sunglasses/RB3025%20MALE%20117-aviator%20classic-gold/8053672495171) exposes model code `RB3025 181/71`, pilot shape, metal frame, grey gradient lens, lens category 3N and size 58-14. These facts may be used only after checking they match the seed's intended size/variant; no driving/outdoor suitability claim is made here.
- **Persol PO0649 95/31:** [Persol official page](https://www.persol.com/de-de/products/0po0649-95_31) identifies the 649 Original with black frame and green lenses. The page supports model/color/lens-color identification, but does not establish a use-case recommendation. Do not infer polarization from a related PO0649 variant.
- **CAZAL 607 001:** [CAZAL official model page](https://www.cazal-eyewear.com/products/mod-607) lists variant 001 as black and describes the frame material as acetate. The seed record currently says frame color `gold + black` and frame material `nylon`. This is a **catalog fact discrepancy** requiring source-record review; do not silently overwrite it, because the source page may not identify the exact supplied SKU/variant.
- **Exact-variant caution:** search results for the Ray-Ban model family and other product families may surface related colors or sizes. Unless the exact model/color code matches, treat variant-specific details as unverified.
- For the remaining 12 records, this pass did not establish a reliable exact-SKU source sufficient to change catalog facts. Their use-case suitability remains `unknown`; this is not a finding that they are unsuitable.

## Acceptance checks before implementation

1. Product evidence is recorded and traceable for each positive or negative suitability assertion.
2. Missing or conflicting source data stays `unknown`.
3. The feed contract validates the vocabulary and evidence fields; it rejects invented values and malformed evidence.
4. COR's versioned Domain Pack consumes only canonical values.
5. Tests prove: supported match affects rank only when evidence exists; unknown does not earn a positive match; hard constraints fail closed.
6. The current catalog oracle and live deployment smoke tests pass before enabling the criterion in the demo.

**Scope:** documentation only. This audit does not change the live installation, credentials, Render configuration, catalog facts, or recommendation weights.
