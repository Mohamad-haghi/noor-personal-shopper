# Product Proof Evidence Index

This directory is the evidence index for the COR/NOOR product demonstration.

## Existing registered evidence

- [2026-10-30 live COR recommendation traces and NOOR browser evidence](./2026-10-30-live-noor-cor-browser-traces.json) — 13 direct live scenarios plus Chromium and WebKit UI runs, with exact runtime and installation pins.
- [NOOR recommendation trace test procedure](../COR_RECOMMENDATION_TRACE_TEST.md) — explains the trace marker, required fields, matching procedure and limitations.

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
