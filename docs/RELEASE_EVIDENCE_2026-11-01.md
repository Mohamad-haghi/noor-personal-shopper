# NOOR Demo — Engineering Status and Release Evidence
**Snapshot:** 2026-11-01  
**Purpose:** current handoff for engineers maintaining the demo. GitHub history remains the detailed audit trail.

## Product boundary

NOOR is a Persian-first demo/reference storefront for the COR Shopper decision engine. It is not a live NOOR commerce integration.

- 15 public demo products; demo-only availability; real prices are null.
- No real NOOR inventory, customer account, cart, checkout, payment or order integration.
- The /manager view is illustrative, not a secured production dashboard or real sales analytics.
- Product-image provenance and commercial-use rights must be confirmed before commercial customer-facing use.
- Never place a reusable COR secret in a Vite/browser environment variable.

## Current deployed pins

- NOOR Pages commit: `9122a6445be9878ddfef5126453efbc765200668` (PR #106 merge).
- COR Render commit: `bd7a215dbd9154f9638687636167e4d980309e32`.
- COR staging installation: `70826f81-a11d-455b-9c33-de7e02303512`, config v2.
- Mapping `noor-eyewear-catalog` v1.2.0; Domain Pack `noor-eyewear-demo` v1.2.0.
- Live demo: https://mohamad-haghi.github.io/noor-personal-shopper/
- Feed: https://mohamad-haghi.github.io/noor-personal-shopper/catalog-feed.json
- Pages workflow: [#41313300976](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41313300976).

## Merged work and evidence

### PR #105 — live UI trace correlation
- Merged commit `5257467d90e69568b61c5650eee3e5098c54c0d4`.
- Pages run #41280904612 passed Chromium and WebKit.
- Trace schema 1.2.0; 10 controlled catalog API scenarios; 13 direct API traces archived in COR evidence.
- Scores are normalized match scores, not probabilities.

### PR #106 — sunglasses titanium counselor option
- Merged commit `9122a6445be9878ddfef5126453efbc765200668`.
- Titanium is selectable as a sunglasses material; counselor explicitly warns that the current catalog has no verified sunglasses titanium-frame product. If mandatory, zero results are expected.
- Build Verification [#41313127496](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41313127496): 32/32 test files; 126/126 tests; TS/Vite build passed.
- Pages deployment [#41313300976](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41313300976): final browser attempt passed Chromium + WebKit; three COR-backed recommendations matched visible order/scores; zero console errors. Controlled live scenarios included session, recommendations, mandatory-condition zero results, compare and handoff.

## Open / unmerged work (not deployed)

- [PR #92](https://github.com/Mohamad-haghi/noor-personal-shopper/pull/92): extended catalog provenance/mapping candidate; Draft/unmerged.
- [PR #103](https://github.com/Mohamad-haghi/noor-personal-shopper/pull/103): category-aware counselor option normalization; Draft/unmerged. Do not attribute its unmerged changes to the deployed site.
- [COR PR #317](https://github.com/Mohamad-haghi/digital-sales-core/pull/317) and [#318](https://github.com/Mohamad-haghi/digital-sales-core/pull/318): test-only Draft PRs; CI/live probes passed but not merged/deployed.

## Verification status

| Capability | Status |
|---|---|
| Public 15-product demo feed contract | VERIFIED in CI |
| COR-backed live recommendation/session | RUNTIME-VERIFIED |
| Top-three score/order and UI percentages | RUNTIME-VERIFIED for recorded Chromium/WebKit scenarios |
| Mandatory sunglasses titanium zero-result behavior | RUNTIME-VERIFIED |
| Compare and product-level handoff API scenarios | Exercised in controlled live workflow |
| Demo save/compare/purchase-handoff journey | Previously owner-tested; do not repeat without new evidence |
| Production NOOR commerce integration | NOT IMPLEMENTED / OUT OF SCOPE |
| Production security/privacy/commercial image-rights review | OPEN before commercial production use |

## Operating rules

1. Keep the demo independent from real NOOR commerce systems.
2. Treat GitHub Pages and COR Render as separate deployments with separately recorded SHAs.
3. Never infer product facts; unknown/conflicting catalog values remain unknown.
4. Never describe normalized match percentages as probability.
5. Do not repeat closed save/compare/handoff tests without contradictory evidence.
6. Any code change must record exact source SHA, CI run, deployment run and runtime pin.
7. Read the COR environment map before changing COR branch/service/database/Clerk/install wiring: [COR ↔ NOOR environment map](https://github.com/Mohamad-haghi/digital-sales-core/blob/feat/database-backed-installation-trust/docs/COR_NOOR_ENVIRONMENT_BRANCH_MAP_V1.md).
