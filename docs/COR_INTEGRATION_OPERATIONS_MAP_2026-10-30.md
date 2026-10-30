# NOOR ↔ COR Integration Operations Map — 2026-10-30

**Purpose:** engineer entry point for the NOOR demo and its COR decision-service connection.
**Status:** verified operational snapshot; demo-only.
**Canonical cross-system map:** [COR environment map PR #308](https://github.com/Mohamad-haghi/digital-sales-core/pull/308), which updates the canonical topology and adds the branch/PR hygiene register.

## 1. Actual live request path

NOOR main @ d58ba221
→ GitHub Pages workflow
→ checks out COR package at d306c5ef (fixed SHA)
→ builds with VITE_NOOR_MODE=integrated
→ embeds https://digital-sales-core.onrender.com
→ deploys https://mohamad-haghi.github.io/noor-personal-shopper/
→ browser calls COR Shopper API on Render service srv-dbfk5qmi0phs73b018t0
→ Render source branch feat/database-backed-installation-trust, live commit d5737543…
→ COR staging Installation 70826f81-a11d-455b-9c33-de7e02303512
→ Neon cor-noor-staging / staging / cor_staging.

The separate URL https://cor-noor-test.onrender.com/operator-console is linked in the NOOR README as the operator console. It is a separate Render service on COR main; it is not the API origin embedded in the NOOR Pages build.

## 2. Exact version pins

| Layer | Value |
|---|---|
| NOOR main source | d58ba221122b9124460cd17c267ead53abaaac2c |
| COR package checked out by Pages workflow | d306c5efee32707362ac2ee449ef85f95cd876a5 |
| COR API runtime on Render | d5737543918c92401ebf5dbff1f0e5c0ef50dc70 |
| Pages build run | #726 / 41023730030 — success |
| Browser smoke run | #277 / 41023729995 — success |

The package SHA and runtime SHA differ by design: the former supplies frontend/shared contract code; the latter serves the HTTP API. Update the Pages workflow pin and package dependency together when changing the frontend COR dependency.

## 3. What the current workflow verifies

The current .github/workflows/deploy-pages.yml:
- checks out COR at the pinned SHA in both build and browser jobs;
- builds integrated mode against digital-sales-core.onrender.com;
- validates the deployed 15-product catalog feed, including demoOnly=true;
- checks CORS preflight and short-lived demo-session issuance;
- checks baseline recommendations and a controlled hard-constraint no-match case;
- calls the live comparison API and validates two returned product IDs;
- calls the live demo product-detail handoff API and validates an HTTPS destination;
- runs the real NOOR recommendation UI smoke in Chromium and WebKit.

This provides live API smoke evidence for recommendations, comparison and demo product-detail handoff, plus real-browser recommendation-journey evidence. It does not test payment, order creation, real inventory, or commercial checkout. Do not conflate a demo purchase/visit handoff with a real transaction.

Latest audited main runs on 2026-10-30:
- Pages run #726: https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41023730030
- Browser smoke #277: https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41023729995

## 4. Recommendation evidence and limits

Evidence file: docs/evidence/2026-10-30-live-noor-cor-browser-traces.json

It contains 13 direct live COR scenario traces plus separate Chromium and WebKit runs, with request IDs and matching server trace evidence. It can check:
- exact normalized intent received by COR;
- candidate order and score;
- score numerator/denominator arithmetic;
- displayed UI score/order against COR response;
- runtime/installation/mapping/Domain Pack pins.

It does not prove the source facts in the catalog are correct. It does not turn a normalized match score into a probability of suitability. Product-data correctness, criterion validity, and commercial relevance remain separate acceptance gates.

## 5. Catalog contract and known gaps

The catalog has 15 demo products. It is not live NOOR inventory and has no real prices, stock, cart, payment, or orders.

Source/export path:
- source: src/providers/demo/demo-catalog-seed.ts
- exporter: scripts/export-demo-catalog-feed.mjs
- published output: public/catalog-feed.json

Required discipline:
- keep exact SKU/variant identity;
- preserve source URL and source timestamp per attribute where possible;
- distinguish manufacturer-published facts from derived fit assessments;
- use Verified, Unknown, and Conflict states;
- do not infer missing values from a model family or sibling color variant;
- unknown attributes must not be used as a definite match or mismatch.

Known work:
- NOOR PR #67 merged the faceCompatibility export path; it does not validate every product's face-fit values.
- NOOR PR #52 remains open and proposes canonical eyewear attributes such as lens features and prescription capability.
- NOOR PR #92 remains draft and proposes exact-SKU corrections for Ray-Ban RB3025 181/71 and CAZAL 607 001.
- NOOR PR #90 remains draft and documents evidence requirements for use-case ranking.

The product data is not yet an approved ranking oracle. Complete the 15-SKU audit before designing hard-constraint acceptance tests.

## 6. Open NOOR PRs at audit time

| PR | Head branch | State / work |
|---|---|---|
| #92 | fix/catalog-exact-sku-facts | draft; exact SKU corrections |
| #90 | docs/use-case-product-evidence-audit | draft; evidence requirements for use-case scoring |
| #60 | test/live-cor-browser-smoke-workflow | draft; opt-in live browser smoke |
| #56 | fix/browser-smoke-cor-shape-v11 | open; browser smoke / Domain Pack alignment |
| #52 | fix/cor-recommendation-feed-v1-2 | open; canonical catalog attribute export |
| #51 | diagnose/cor-domain-pack-shape-alias | open; shape-key diagnostic |
| #6 | docs/prepare-demo-hero-image-upload-v1 | open; demo asset documentation |
| #96 | docs/cor-integration-operations-map-20261030 | draft; canonical NOOR documentation consolidation; Build Verification run #738 passed on final head 91340235b3711159ef2c1307395518497ba189ac |

An open PR is not a live fix. Check target branch, merge commit, deployed NOOR SHA, COR package pin, and live runtime before closing any issue.

## 7. NOOR branch inventory and cleanup

At audit time GitHub returned 98 NOOR branches. Main is the Pages source. Eight open PRs are listed above, including #96; duplicate documentation PR #97 was closed as superseded by #96 and its branch remains. Other branches must be classified by merged/closed PR ancestry, unique commits, workflow references, and evidence value before cleanup.

Do not mass-delete branches. Preserve main, open-PR heads, refs referenced by Render/Pages workflows, and evidence/checkpoint branches until their content is represented in canonical docs.

No published NOOR GitHub Release was found. The default branch was reported unprotected; add required CI/PR protections before treating main as a controlled release branch.

## 8. Current blockers and next sequence

1. Fix missing Persian white → canonical white mapping in the NOOR recommendation bridge, including optional and mandatory regression tests.
2. Complete exact-SKU/source-backed audit of all 15 products; do not fabricate unknown fields.
3. Preserve unknown criteria through COR response and NOOR explanations, or suppress candidates with unknown critical mandatory attributes.
4. Keep useCase context-only unless Domain Pack criteria and catalog evidence are deliberately extended.
5. Build the live test matrix only from verified catalog capabilities: positive hard match, negative no-match, soft preference, mandatory criteria, and unknown-data handling.
6. Run controlled live NOOR tests against Installation 708… and save Request IDs + full Render traces.
7. Update Issue #266 with each gate's evidence and close only when the evidence is reproducible.

## 9. Demo and security boundaries

- The demo uses a public 15-product feed and demo-only short-lived session credentials.
- No static COR secret belongs in the Vite/browser bundle.
- Do not claim live NOOR inventory, live pricing, orders, payments, or production checkout.
- Keep installation 745… untouched; use isolated staging Installation 708… for controlled recommendation testing.
- Never include bearer credentials, authorization headers, connection strings, or secret values in evidence files.

**Last audited:** 2026-10-30. Re-check workflow/deploy metadata before changing pins or deploying.
