# COR Shopper Demo Integration — Current Guide

**Last reconciled:** 2026-11-03  
**Status:** Integrated demo path is deployed and bounded engineering acceptance is recorded in [Release Evidence](./RELEASE_EVIDENCE_2026-11-01.md).

## 1. Purpose and boundary

NOOR is a Persian-first demo/reference storefront. In integrated mode, recommendation, comparison and product-level handoff operations use the independently deployed COR Shopper API within the tested demo scope. This is not a live NOOR commerce integration.

- The public catalog contains 15 demo products.
- Availability and commerce behavior are illustrative; real prices are null.
- No real NOOR inventory, customer account, cart, checkout, payment or order system is connected.
- No real purchase or payment occurs.
- The `/manager` view is illustrative, not a secured production dashboard or real sales analytics.
- Product-image provenance and commercial-use rights must be confirmed before commercial customer-facing use.

## 2. Current verified pins

- Public demo: https://mohamad-haghi.github.io/noor-personal-shopper/
- Public catalog feed: https://mohamad-haghi.github.io/noor-personal-shopper/catalog-feed.json
- COR Shopper runtime: https://cor-noor-test.onrender.com
- Staging installation: `70826f81-a11d-455b-9c33-de7e02303512`, config v2.
- Mapping: `noor-eyewear-catalog` v1.2.0.
- Domain Pack: `noor-eyewear-demo` v1.2.0.
- Latest Pages source commit recorded by release evidence: `b4a03ac383435296562d96f94db4a901f4b82e86`.
- Latest Pages deployment/acceptance run recorded: [41460220608](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41460220608).
- COR Render runtime commit recorded: `bd7a215dbd9154f9638687636167e4d980309e32`.

Use the dated release evidence for exact scenarios, workflow runs and acceptance boundaries. A documentation commit does not by itself change the deployed Pages application.

## 3. Decision and catalog behavior

- The COR percentage shown in NOOR is a normalized match score, not a probability of purchase or fit.
- The counselor must preserve user intent. Do not restrict options to the current catalog or silently rewrite a selected preference.
- If mandatory criteria have no eligible product, show the explicit no-results state; do not substitute an incompatible item.
- Unknown or conflicting product attributes remain unknown and must not be inferred.
- The 15-item demo catalog is not a live inventory feed.

## 4. Browser configuration and security

Integrated mode uses these public Vite settings only:
- `VITE_NOOR_MODE=integrated`
- `VITE_COR_SHOPPER_BASE_URL=https://<cor-service-origin>`

The COR base URL must be a valid HTTPS origin without path, query, fragment, username or password (except localhost development).

Never place `COR_SHOPPER_HMAC_SIGNING_KEY`, database credentials, reusable API keys, bearer tokens or other secrets in a `VITE_*` variable or browser bundle. The browser obtains a short-lived demo-only credential from COR at runtime.

The public demo-session endpoint is not user authentication or production customer authorization. Exact Origin checks are browser policy, not identity proof. This flow is only suitable for the explicitly demo-only, read-only single-installation boundary.

## 5. Current handoff limitation

The current COR runtime rejects variant-specific handoff requests. NOOR therefore requests only a server-resolved product-level destination and must not submit a browser-provided destination URL. Do not claim that a selected variant is preserved by handoff until the COR contract and runtime support it.

## 6. Verification status

The latest release evidence records:
- 15-product feed structure and exact-SKU evidence-gated feed as passed.
- Controlled live COR recommendation/session, score/order and hard no-match scenarios as runtime-verified for recorded cases.
- Comparison and product-level handoff API scenarios exercised in the controlled workflow.
- Chromium and WebKit browser acceptance passed for the recorded scenarios.
- Save/compare/demo-purchase journey previously owner-tested; do not repeat without contradictory evidence.
- Production NOOR commerce integration remains out of scope.

Read [Release Evidence](./RELEASE_EVIDENCE_2026-11-01.md) for detailed run IDs and limitations. Engineering acceptance is not a production security certification.

## 7. Operational guardrails

1. Read the [COR ↔ NOOR Environment, Branch, and Installation Map](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md) before changing COR branch, Render service, Neon database, Clerk wiring or installations.
2. Keep the old known-good installation `745f6e81-a741-4ed6-8671-73000259b6c8` untouched unless explicitly approved.
3. Keep staging installation `70826f81-a11d-455b-9c33-de7e02303512` separate from the old baseline.
4. Do not change COR infrastructure for visual-only NOOR work.
5. Record exact GitHub source SHA, workflow run, deployment run, runtime pin and tested operation for any code change.
6. Distinguish CI, direct HTTP checks and real browser end-to-end evidence.
7. Never record secrets, bearer tokens, authorization headers or raw credential responses in documentation.
