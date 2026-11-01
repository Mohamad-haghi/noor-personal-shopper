# NOOR 15-SKU catalog evidence — independent review packet

**Review target:** NOOR PR #92, candidate branch `fix/catalog-exact-sku-facts`  
**Current candidate commit at packet preparation:** `2bef438e4a352f03872b1b82fd1dab87cb1e060a`  
**Primary implementation:** `src/providers/demo/demo-catalog-evidence.ts`, `src/providers/demo/demo-catalog-seed.ts`, `scripts/export-demo-catalog-feed.mjs`  
**Generated-feed verifier:** `scripts/verify-demo-catalog-feed.mjs`  
**Source audit:** `docs/NOOR_DEMO_CATALOG_SOURCE_AUDIT_2026-10-30.md`  
**Build workflow / production COR dependency:** `d306c5efee32707362ac2ee449ef85f95cd876a5` (same commit pinned by `.github/workflows/deploy-pages.yml`). Exact-head Build Verification #875 is pending at packet creation.

## Purpose

Review the exact SKU identity and field-level evidence for the 15-item NOOR demo catalog before any counselor, scoring-weight, visual-release or deployment work proceeds.

This is a reference/demo storefront. It does not represent live NOOR inventory, verified live pricing, orders, payments or commercial checkout. The feed uses synthetic demo availability and null prices.

## Required reviewer procedure

1. Check each NOOR reference and SKU against the exact source variant; reject family-level or sibling-UPC substitution.
2. For every `verified` field, confirm the cited page identifies the exact model/color code and that the captured source value matches the corresponding seed field.
3. For every `conflict`, confirm both sources are for the same exact variant and that the seed/feed do not select an unsupported scalar.
4. For multi-valued facts, confirm the full source array is retained in the seed (e.g. `frameShapesSource`, `frameMaterialComponents`, `frameColorComponents`) and is not flattened into the current scalar COR contract.
5. For `unknown` fields, confirm the feed withholds the value and no style/category/UV-only inference is presented as face or use-case suitability.
6. Inspect the generated feed and the independent COR ranking oracle. Confirm the feed exposes no internal `catalogEvidence`, real price, or non-demo availability claim.
7. Confirm the CI job uses the same COR dependency SHA as Pages deployment: `d306c5efee32707362ac2ee449ef85f95cd876a5`. Earlier candidate runs that used `54065f21cc9134bd6de6196aa5f4b41a9ec3fd0e` are not production-dependency parity evidence.

## SKU review index

| NOOR reference | Exact SKU | Key disposition requiring review |
|---|---|---|
| `1000053268` | RB3025 181/71 | Exact UPC `8053672495188` = 62-14-140; UPC `8053672495171` is a distinct 58-14-135 sibling. |
| `1000087540` | PO0649 95/31 | Persol official exact 95/31 page resolves frame material as acetate; black, green crystal lens and 54 mm width recorded. |
| `1000088890` | OO9318 02 34 | Do not transfer shape/material from another OO9318 color code; unresolved facts remain withheld. |
| `1000103998` | FT0778 01A 60 | Verify each accepted field against the exact 01A 60 variant source, not other FT0778 colors/sizes. |
| `1000127057` | PR03YS 2AU6S1 | Mixed front/temple material is preserved as components; no forced scalar material. |
| `1000084476` | DG2204 12988G 64 | Frame color conflict (gold vs pink-gold) is withheld; grey lens, plastic lens material and UV400 are source-recorded. |
| `1000100480` | 30MONTAIGNE EPZ/1I | Plastic frame material verified; square + oval source shapes retained as array; frame/lens colors conflicted and withheld. |
| `1000104615` | GG0900S 005 | Square vs wrap/shield conflict; frame material and composite frame color withheld; yellow lens retained. |
| `1000058221` | 8314O NN030 | Multi-valued acetate + metal material and angular + oval shapes retained as arrays; no scalar flattening. |
| `1000109052` | RB6461 2500 | Exact 2500 code must not inherit shape/material from 2943 or 2502 variants; unresolved fields withheld. |
| `1000104076` | FT5661 001 | NOOR record omits `-B` / `-B-N` suffix; shape/material/color/lens/dimensions withheld until exact suffix is identified. |
| `1000112234` | PR51YV 04Q1O1 | Female, titanium and matte black are source-backed; square vs rectangular shape conflict and face fit withheld. |
| `1000106967` | VA1021 3003 | Exact color-code sources disagree on irregular vs round/geometric; shape and face fit withheld. |
| `1000127106` | 607 001 | Black acetate + gold metal construction retained as components; scalar material/color and temple material withheld. |
| `1000044519` | PO3011 095 | Exact NOOR page verifies acetate, black, unisex, clear lens and multi-value shapes/face suitability; arrays withheld from scalar COR feed. |

The ledger is authoritative for per-field status, raw source value, normalized value, source URL, source label, capture date and rationale. This table is only a navigation index; it does not replace field-by-field review.

## Automated evidence available

- NOOR Build Verification #872 passed on prior code head `f753139ce257e3cea7437ac21d93381a0c807857`: 35/35 files, 144/144 tests, TypeScript/Vite build.
- #872 ran `scripts/verify-demo-catalog-feed.mjs`, confirming 15 unique products/references, evidence-gated feed values, no real prices, synthetic demo-only availability and no provenance-ledger leakage.
- The next exact-head run is #875, pending at packet creation, after aligning the NOOR build workflow's COR checkout to the same SHA used by the Pages deployment workflow.
- The live browser/COR handoff job is not part of pull-request CI and has not been run on this candidate; no deployed proof is claimed.

## Acceptance decision

The reviewer should leave a formal GitHub PR review on [NOOR PR #92](https://github.com/Mohamad-haghi/noor-personal-shopper/pull/92), citing any SKU/field that fails exact identity or value reconciliation.

- [ ] Exact SKU identity checked for all 15 records
- [ ] Every verified ranking field source-backed and equal to the seed value
- [ ] Every conflict/unknown safely withheld from scalar feed output
- [ ] Multi-valued attributes preserved without scalar flattening
- [ ] Generated feed and COR oracle behavior accepted
- [ ] No use-case suitability inferred without separate evidence
- [ ] Exact Pages dependency pin used by CI and production
- [ ] Remaining limitations accepted and documented

**Reviewer:**  
**Review date:**  
**Decision:** Approve / Request changes / Comment  
**Reviewed candidate SHA:**  
**Notes / required corrections:**

## Release boundaries

Do not merge PR #92 or PR #96, deploy GitHub Pages, mutate the live COR installation, change Render/Neon/Clerk, or start visual release testing solely because this packet exists. Approval is an evidence review only; release/deployment authorization remains separate.
