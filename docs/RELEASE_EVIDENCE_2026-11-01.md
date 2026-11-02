# NOOR Demo — Engineering Status and Release Evidence
**Snapshot:** 2026-11-02 (post-deployment acceptance complete)  
**Purpose:** current handoff for engineers maintaining the demo. GitHub history remains the detailed audit trail.

## Product boundary

NOOR is a Persian-first demo/reference storefront for the COR Shopper decision engine. It is not a live NOOR commerce integration.

- 15 public demo products; demo-only availability; real prices are null.
- No real NOOR inventory, customer account, cart, checkout, payment or order integration.
- The /manager view is illustrative, not a secured production dashboard or real sales analytics.
- Product-image provenance and commercial-use rights must be confirmed before commercial customer-facing use.
- Never place a reusable COR secret in a Vite/browser environment variable.

## Current deployed pins

- NOOR Pages source/main commit: `7d98b8b5753aa06969e61c711e53d21a2a355109`.
- COR Render commit: `bd7a215dbd9154f9638687636167e4d980309e32`.
- COR staging installation: `70826f81-a11d-455b-9c33-de7e02303512`, config v2.
- Mapping `noor-eyewear-catalog` v1.2.0; Domain Pack `noor-eyewear-demo` v1.2.0.
- Live demo: https://mohamad-haghi.github.io/noor-personal-shopper/
- Feed: https://mohamad-haghi.github.io/noor-personal-shopper/catalog-feed.json
- Earlier Pages workflow: [#41313300976](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41313300976). Latest deployment and acceptance: [#41458169285](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41458169285).

## Merged work and evidence

### PR #105 — live UI trace correlation
- Merged commit `5257467d90e69568b61c5650eee3e5098c54c0d4`.
- Pages run #41280904612 passed Chromium and WebKit.
- Trace schema 1.2.0; controlled catalog API scenarios and direct API traces archived in COR evidence.
- Scores are normalized match scores, not probabilities.

### PR #106 — sunglasses titanium counselor option
- Merged commit `9122a6445be9878ddfef5126453efbc765200668`.
- Titanium remains selectable as a sunglasses material; counselor can communicate that the current demo catalog has no verified sunglasses titanium item. If mandatory, zero results are expected. **Keep this choice; do not remove it to fit current inventory.**
- Build Verification [#41313127496](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41313127496): 32/32 test files; 126/126 tests; TS/Vite build passed.
- Latest Pages deployment [#41458169285](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41458169285): deploy, HTTPS feed verification, live COR API acceptance, Chromium and WebKit all passed.

## Corrected verification status

| Capability | Status |
|---|---|
| 15-product feed structural contract | VERIFIED (15 unique IDs, demoOnly, null real prices, synthetic availability) |
| Exact-SKU truth/provenance in deployed feed | **PASS — deployed**; Pages HTTPS feed check and live COR API acceptance passed |
| Exact-SKU evidence ledger and typed feed | **MERGED + DEPLOYED** in PR #108; exact-head CI 35/35 files, 146/146 tests; Pages run #41458169285 feed, API and Chromium checks passed |
| COR-backed live recommendation/session | RUNTIME-VERIFIED for recorded scenarios |
| Top-three score/order and UI percentages | RUNTIME-VERIFIED for recorded Chromium/WebKit scenarios |
| COR no-results for mandatory criteria with no match | API RUNTIME-VERIFIED (HTTP 200 / zero results); Persian NOOR empty-state renderer assertion PASS in #111 CI; no incompatible fallback |
| Counselor options restricted to current catalog | **NOT REQUIRED / OUT OF SCOPE** |
| Compare and product-level handoff API scenarios | Exercised in controlled live workflow |
| Demo save/compare/purchase-handoff journey | Previously owner-tested; do not repeat without new evidence |
| Production NOOR commerce integration | NOT IMPLEMENTED / OUT OF SCOPE |

## Exact-SKU catalog/feed audit — resolved and deployed

PR #108 replaced the old feed projection with an evidence-gated exporter. The field-level ledger stays in build-time/test code and is not imported by the browser seed or shipped in the client bundle. The public feed preserves typed arrays and withholds unknown/conflicting values. The Pages HTTPS feed check and live COR scenarios now exercise the deployed feed.

The deployed Pages feed now uses the evidence-gated exporter. The current Pages run verifies the public 15-product feed and exercises it through the live COR Mapping 1.2 API scenarios. Unknown/conflicting facts are withheld; typed multi-value facts remain arrays. Trace completeness and source provenance are tracked separately.

NOOR PR #108 is **merged**. Exact-head CI [#41456324962](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41456324962) passed: 35/35 files, 146/146 tests, feed verifier and Mapping v1.2 integration. The Pages deployment [#41458169285](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41458169285) passed deployment, HTTPS feed verification, 10 controlled COR scenarios, hard no-match, comparisons/handoffs, and Chromium + WebKit browser smoke. The follow-up test-only PRs #109/#110 corrected the oracle for typed arrays and equal-score tie ordering; PR #111 adds an explicit test for the Persian mandatory no-match UI copy (35/35 test files and build/feed/Mapping integration pass in run [#41460023173](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41460023173)).

Examples that must remain conservative:
- Gucci GG0900S 005: disputed/unknown shape, material, color and face-fit facts must not be asserted.
- Prada PR03YS: mixed plastic+metal construction must not be reduced to a single nylon claim.
- OGA 8314O NN030: componentized acetate+metal and multi-value shape must retain typed values.
- Tom Ford FT5661 001: exact suffix unresolved; do not invent variant facts.
- Prada PR51YV: titanium/female/matte-black supported; disputed shape remains withheld.

## Owner decision — explicit no-go for counselor/catalog filtering

**Do not narrow the counselor's options to match the current 15 demo products.** The user intentionally may ask for products that are not in the current demo catalog. COR must evaluate the request and return a clear no-results message when no eligible product exists. Do not remove round/titanium/other preferences, do not make options conditional on catalog contents, and do not revive/merge NOOR PR #103 for category-specific option restrictions. The no-match outcome is a valid capability, not a defect to hide.

This instruction does not permit inaccurate request serialization: the intent selected in the counselor must not be silently changed when sent to COR. Do not redesign or restrict choices as a workaround.

## Final engineering acceptance and handoff

1. NOOR #108 is merged and deployed. Evidence provenance remains build-time/test-only; typed arrays are preserved and unknown/conflicting facts are withheld.
2. Live Pages run [#41458169285](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41458169285) passed: deployment, public 15-product HTTPS feed, 10 controlled COR scoring/ranking scenarios, hard no-match (HTTP 200 / zero recommendations), comparison/handoff APIs, and actual NOOR UI in Chromium + WebKit. Both browsers showed three cards with displayed scores/order matching the COR response; no console errors, warnings or failed requests.
3. PRs #109/#110 corrected the independent live-score oracle for typed arrays and equal-score ties. PR #111 adds a renderer test for the Persian mandatory no-match message and no-substitute behavior; CI [#41460023173](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41460023173) passed (35/35 test files, build, evidence-gated feed and COR Mapping v1.2 integration).
4. The live no-match API outcome and the UI renderer are verified separately: COR returned HTTP 200 with zero recommendations for hard round+titanium; NOOR's renderer shows “محصول منطبق با شرط‌های اجباری پیدا نشد”, identifies mandatory criteria, offers a return-to-counselor action, and does not show a substitute. The current Chromium/WebKit browser smoke did not itself drive the no-match screen.
5. Counselor options remain broad by explicit owner decision. Do not implement catalog-driven filtering, do not revive PR #103, and do not alter user intent to force a catalog match.
6. Keep previously owner-tested save/compare/handoff/demo-purchase flows closed; do not repeat them without contradictory evidence.
7. Engineering feed/API/browser acceptance is complete for the bounded demo scope. Next step: owner-led NOOR demo styling/presentation.

## Cross-repository COR security/reliability proof — 2026-11-02

Stage 6 live security/reliability checks are **PASS / CLOSED** within the isolated demo/staging test boundary. Evidence includes PostgreSQL-backed credential revocation and expiry denial, fail-closed HTTP 503 during isolated database outage, restored HTTP 200, standard startup restoration, and deletion/verification of the disposable Render service and Neon child branch.

- COR current status and stage board: [COR + NOOR current engineering status](https://github.com/Mohamad-haghi/digital-sales-core/blob/docs/cor-noor-current-status-2026-11-01/docs/COR_NOOR_CURRENT_STATUS_AND_EVIDENCE_2026-11-01.md)
- Detailed run IDs, outcomes and cleanup proof: [Gate 6 evidence](https://github.com/Mohamad-haghi/digital-sales-core/blob/docs/cor-noor-current-status-2026-11-01/docs/evidence/2026-11-02-gate-6-live-verification-and-cleanup.md)
- Test/evidence implementation remains Draft and unmerged: [COR PR #318](https://github.com/Mohamad-haghi/digital-sales-core/pull/318).

This is not a production security certification.

## Operating rules

1. Keep the demo independent from real NOOR commerce systems.
2. Treat GitHub Pages and COR Render as separate deployments with separately recorded SHAs.
3. Never infer product facts; unknown/conflicting catalog values remain unknown.
4. Never describe normalized match percentages as probability.
5. Do not repeat closed save/compare/handoff tests without contradictory evidence.
6. Any code change must record exact source SHA, CI run, deployment run and runtime pin.
7. Do not implement counselor-option/catalog alignment. Keep all intended user choices available and let COR return no-results when appropriate.
8. Test-only follow-ups #109 and #110 are merged; they make the live ranking oracle understand typed arrays and tolerate different ordering only among equal-score products. No COR runtime or scoring change.
9. Latest Pages workflow [#41458169285](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41458169285) completed successfully. Chromium request ID: `noor-test-1793628304778-fi97ipv5`; WebKit request ID: `noor-test-1793628348770-l7z17j1x`; both showed 3 cards, no console errors/warnings/failed requests, and matched COR API responses. Browser artifact: `noor-cor-live-browser-proof`.
8. Read the COR environment map before changing COR branch/service/database/Clerk/install wiring.
