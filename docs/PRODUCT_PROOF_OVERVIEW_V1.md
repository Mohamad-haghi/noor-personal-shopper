# COR + NOOR — Product Proof Overview v1.0

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
- Live COR API smoke for comparison (two product IDs) and product-level HTTPS handoff passed in NOOR Pages run #277. The corresponding NOOR UI states still need real visual/browser evidence before they are claimed as fully demonstrated end-to-end.
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

**Evidence-backed demonstration in progress.** The product-proof release is complete only when the missing live comparison/handoff evidence, catalog fact review for showcased products, visual record and exact release manifest are accepted.
