# COR + NOOR — Product Proof Overview v1.0

> **Engineering status and execution order:** Use [COR Issue #266 — Product Proof Execution Board](https://github.com/Mohamad-haghi/digital-sales-core/issues/266) as the mandatory cross-repository status board. The detailed gate plan is [COR/NOOR Product Proof Release Plan v1.0](https://github.com/Mohamad-haghi/digital-sales-core/blob/docs/cor-noor-operations-map-20261030/docs/COR_NOOR_PRODUCT_PROOF_RELEASE_PLAN_V1.md). This file is the public-safe product overview, not a second execution plan. Do not repeat accepted tests; contribute only evidence for currently open gates.


**Purpose:** Public-safe overview of a working product demonstration. This is not a commercial-production or customer-launch claim.

## Live product

- **NOOR Personal Shopper demo:** https://mohamad-haghi.github.io/noor-personal-shopper/
- **Demo catalog feed:** https://mohamad-haghi.github.io/noor-personal-shopper/catalog-feed.json

NOOR is a Persian-first reference storefront. In integrated mode, its recommendation experience calls the independently deployed COR Shopper API. The catalog and commerce journey are demo-only.

## What the team has demonstrated

- Structured shopper intent collected through a guided interface.
- Canonical COR recommendations returned to NOOR.
- Criterion-level decision traces with candidate scores and score recomputation.
- Preference-sensitive ranking and hard-constraint no-match behavior.
- NOOR rendering of COR product IDs, candidate order and normalized match scores.
- Candidate-build NOOR UI comparison and product-level handoff are now proven in isolated Chromium: PR #101, run #7 (41189573643), head `c7790cfc1908f1c1f4833768a78a762054b1a784`. Three cards, comparison attributes, canonical COR comparison/handoff responses, consistent product IDs, visible same-origin product link, demo-cart notice and zero browser errors. This is candidate-build proof only; PR #101 remains Draft/unmerged and the corrected build is not yet deployed to GitHub Pages.
- Selection Profile and demo checkout/confirmation are NOOR demo capabilities, not real COR customer storage or payment processing.

## Existing technical evidence

- [Live COR recommendation trace and browser evidence](./evidence/2026-10-30-live-noor-cor-browser-traces.json)
- [COR recommendation trace test method](./COR_RECOMMENDATION_TRACE_TEST.md)
- [COR Shopper demo integration guide](./COR_SHOPPER_DEMO_INTEGRATION_V1.md)
- [15-product catalog source audit](./NOOR_DEMO_CATALOG_SOURCE_AUDIT_2026-10-30.md)
- [Evidence index and visual-capture requirements](./evidence/README.md)

The 2026-10-30 evidence record contains 13 direct live COR scenarios and two actual NOOR UI browser runs (Chromium and WebKit). The record pins the tested runtime and installation artifacts. The Pages deployment workflow run #277 also passed the live demo-feed, COR session/recommendation, Chromium and WebKit checks.

## Important boundaries

- The 15-item catalog is reference/demo data. Synthetic availability is not live stock; prices are null.
- No real NOOR inventory, account, cart, checkout, payment or order system is connected.
- The demo purchase journey does not perform a real purchase or payment.
- COR percentages are normalized match scores, not probabilities.
- A decision trace proves the engine's calculation over received attributes; it does not prove every catalog attribute is factually correct.
- Product-source conflicts and image-rights/provenance questions remain documented in the catalog audit.
- This dossier does not claim commercial readiness, production security acceptance, customer acceptance, revenue, or service-level guarantees.

## Visual proof status

The repository currently contains product images, not a complete screenshot/video record of the working application. Real screenshots and a short screen recording are still required and will be indexed under [evidence](./evidence/README.md). Do not use mockups or generated images as proof of runtime behavior.

## Release status

**Gate 1 exact deployed COR SHA: PASS** (run 41111579697, exact SHA `d5737543918c92401ebf5dbff1f0e5c0ef50dc70`). **Gate 2 candidate-build comparison/handoff UI proof: PASS / CLOSED** (NOOR PR #101, run 41189573643; not yet deployed to Pages). **Gate 3 bounded 15-product catalog audit: PASS / CLOSED** for the agreed showcase scope; unknown/conflicting facts remain explicit. The next release gate is genuine desktop/mobile screenshots and a short screen recording, followed by final manifest and independent audit. See [COR Issue #266](https://github.com/Mohamad-haghi/digital-sales-core/issues/266) as the single execution board.
