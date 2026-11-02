# Product Proof Evidence Index

This directory is the evidence index for the COR/NOOR product demonstration.

## Existing registered evidence

- [2026-10-30 live COR recommendation traces and NOOR browser evidence](./2026-10-30-live-noor-cor-browser-traces.json) — 13 direct live scenarios plus Chromium and WebKit UI runs, with exact runtime and installation pins.
- [NOOR recommendation trace test procedure](../COR_RECOMMENDATION_TRACE_TEST.md) — explains the trace marker, required fields, matching procedure and limitations.

## Gate 4 capture procedure

- [Gate 4 Visual Evidence Capture Kit](../GATE_4_VISUAL_EVIDENCE_CAPTURE_KIT_2026-10-31.md) — exact capture matrix, naming, metadata manifest, redaction rules, acceptance criteria and current gap.

## Required visual evidence — not yet captured

Capture only from the real deployed application. Never substitute mockups, generated images or product photos for screenshots of application behavior.

Target files:

1. `visual/01-noor-home-desktop.png`
2. `visual/02-shopper-counselor-desktop.png`
3. `visual/03-selection-profile-desktop.png`
4. `visual/04-recommendations-desktop.png`
5. `visual/05-recommendation-explanation-desktop.png`
6. `visual/06-product-comparison-desktop.png`
7. `visual/07-product-handoff-desktop.png`
8. `visual/08-demo-checkout-confirmation-desktop.png`
9. `visual/09-noor-home-mobile.png`
10. `visual/10-recommendations-mobile.png`
11. `visual/11-cor-installation-lifecycle-redacted.png` (only if captured from an authorized operator view)

A short real walkthrough recording may be attached to the GitHub Release as `cor-noor-product-proof-walkthrough-v1.mp4` rather than committed as a large repository file.

## Required metadata for every capture

Record capture timestamp (UTC), browser/device, viewport, public page URL, NOOR commit, COR API runtime commit, installation/configuration/Mapping/Domain Pack/decision-model pins, and the corresponding test or trace request ID where applicable.

Do not capture or publish bearer tokens, authorization headers, cookies, secret values, private account data, or unrelated tenant information. Redact any operator-only detail not necessary to prove the capability.

## Evidence acceptance

A screenshot proves only what is visible in that captured state. Pair it with the relevant request/response, test, CI run or installation record. A video is explanatory evidence, not a substitute for the underlying trace and version manifest.

## Current gap

No application screenshots or screen recording are currently stored in this repository. The 15 images under `public/media/products/` are catalog assets, not product-behavior evidence.


## Accepted gate evidence — 2026-10-31

- **Gate 1 — exact deployed COR runtime SHA:** PASS. [COR exact-SHA run 41111579697](https://github.com/Mohamad-haghi/digital-sales-core/actions/runs/41111579697) checked out and asserted `d5737543918c92401ebf5dbff1f0e5c0ef50dc70`; full COR suite and isolated PostgreSQL checks passed.
- **Gate 2 — candidate NOOR comparison/product handoff UI:** PASS / CLOSED at isolated candidate-build level. [NOOR PR #101](https://github.com/Mohamad-haghi/noor-personal-shopper/pull/101), [workflow run 41189573643](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41189573643), browser artifact ID `13038057840`, SHA-256 `2511edac17e0781ef72fea43ed0049540593023e9eb9fd301bb4fc4d0bdfe0c7`. The artifact records 3 cards, comparison attributes, canonical COR comparison/handoff HTTP 200, `demoOnly=true`, consistent product IDs, visible exact same-origin product route, demo-cart notice and no browser errors. PR #101 remains Draft/unmerged; this does not claim a Pages deployment.
- **Gate 3 — bounded 15-product catalog audit:** PASS / CLOSED for agreed showcase scope. Exact-SKU evidence is linked from [NOOR PR #96](https://github.com/Mohamad-haghi/noor-personal-shopper/pull/96); unsupported/conflicting facts remain unknown.

## Remaining required visual evidence

The screenshot/video set above remains **OPEN**. Capture only from the real deployed application, after the Pages release is explicitly approved. Pair each screenshot with version pins and supporting test/API evidence. Do not use generated imagery, mockups or catalog photos as application-behavior evidence.
