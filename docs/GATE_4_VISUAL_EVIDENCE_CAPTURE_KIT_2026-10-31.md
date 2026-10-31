# Gate 4 — Real Visual Evidence Capture Kit
**Prepared:** 2026-10-31  
**Status:** Capture procedure ready; real screenshots/video still outstanding.  
**Authority:** COR [Issue #266](https://github.com/Mohamad-haghi/digital-sales-core/issues/266). This file defines evidence collection only; it is not a second release plan.

## 1. Purpose and boundary

Gate 4 proves what a person can actually see and do in the NOOR demo. It complements, but does not replace, automated tests, live API traces, COR decision evidence, or the catalog source audit.

Capture the real deployed application in a normal browser. Do not use mockups, generated images, edited composites, screenshots of test reports, or product catalog photos as substitutes for application screenshots. Do not claim the isolated PR #101 preview is the deployed Pages application.

**Deployment qualification:** PR #101 (`c7790cfc1908f1c1f4833768a78a762054b1a784`) remains Draft/unmerged. Capture the currently deployed Pages build only as the currently deployed build; capture the corrected PR #101 candidate only after explicit release approval, merge, successful Pages deployment, and post-deploy smoke. Label the two versions distinctly if both are ever retained.

## 2. Evidence already available — do not repeat

| Evidence | Existing source | What it proves | What it does not prove |
|---|---|---|---|
| 13 live COR scenario traces + Chromium/WebKit UI records | [2026-10-30 trace JSON](./2026-10-30-live-noor-cor-browser-traces.json) | Request intent, candidate order, score arithmetic, rendered recommendation cards, runtime/install pins | Full visual record of every user-facing screen |
| Candidate comparison + product handoff browser proof | [NOOR PR #101 / run 41189573643](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41189573643) | Candidate build: 3 cards, comparison attributes, canonical COR APIs, same-origin product route, demo notice, no browser errors | Current Pages deployment; saved profile and complete demo confirmation screens |
| COR deployed runtime exact-SHA verification | [COR run 41111579697](https://github.com/Mohamad-haghi/digital-sales-core/actions/runs/41111579697) | Exact runtime SHA and isolated COR test/migration evidence | NOOR visual behavior |
| 15-product source audit | [Catalog audit](../NOOR_DEMO_CATALOG_SOURCE_AUDIT_2026-10-30.md) | Source provenance, exact-SKU conflicts and unknowns | General suitability or live inventory |
| Pages live browser/API workflow | [Pages run #277](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41023729995) | Then-deployed Pages build, API smoke, Chromium and WebKit journey | A curated screenshot/video evidence pack |

## 3. Required capture matrix

Use the same scenario/profile across desktop and mobile where applicable. Capture each state only after the page has fully settled. The minimum set is:

| ID | Screen / state | Required visible proof | Target filename |
|---|---|---|---|
| V01 | Home / entry — desktop | NOOR identity, entry point, demo context if displayed | `01-home-desktop.png` |
| V02 | Counselor — desktop | Guided questions and selected criteria | `02-counselor-desktop.png` |
| V03 | Selection Profile — desktop | Saved profile and selected attributes | `03-selection-profile-desktop.png` |
| V04 | Recommendations — desktop | Product names/IDs and normalized match scores | `04-recommendations-desktop.png` |
| V05 | Recommendation explanation — desktop | Match and mismatch explanation; no probability claim | `05-explanations-desktop.png` |
| V06 | Comparison — desktop | Compared products and visible attributes | `06-comparison-desktop.png` |
| V07 | Product handoff — desktop | Product-specific same-origin destination / continuation link | `07-product-handoff-desktop.png` |
| V08 | Demo checkout / confirmation — desktop | Demo-only wording; no claim of real order/payment | `08-demo-confirmation-desktop.png` |
| V09 | Home — mobile | Responsive entry screen | `09-home-mobile.png` |
| V10 | Recommendations — mobile | Responsive cards, IDs and scores | `10-recommendations-mobile.png` |
| V11 | Comparison or handoff — mobile | Responsive comparison or product continuation | `11-comparison-handoff-mobile.png` |

**Optional:** redacted COR installation/lifecycle view only when available through an authorized operator session and only if it can be captured without exposing credentials, private tenant data, or unrelated records. This is not a substitute for the existing COR installation evidence.

## 4. Short walkthrough recording

Record one short, continuous walkthrough (target 60–120 seconds) showing:
1. Open the public NOOR demo.
2. Complete the counselor and save the Selection Profile.
3. Show recommendation cards and their scores/explanations.
4. Compare products.
5. Open the product-level demo handoff.
6. Show the demo confirmation/disclaimer.

Keep the browser address bar visible at least when the public URL and product handoff destination are demonstrated. Do not show password managers, developer secrets, browser storage, authorization headers, private tabs, or personal account information. Do not stage or fabricate a successful state.

Suggested attachment name: `cor-noor-product-proof-walkthrough-v1.mp4`. Prefer a GitHub Release attachment for the video rather than committing a large binary to the source repository. Store screenshots under `docs/evidence/visual/`.

## 5. Capture manifest — required sidecar

Create `docs/evidence/visual/manifest.json` only after actual files exist. One record per capture; do not fill fields from memory or guess.

```json
{
  "capture_set": "cor-noor-product-proof-gate-4",
  "captured_at_utc": "REPLACE_WITH_ACTUAL_ISO8601",
  "environment": "public-github-pages-demo",
  "page_url": "https://mohamad-haghi.github.io/noor-personal-shopper/",
  "noor_commit": "REPLACE_WITH_DEPLOYED_NOOR_SHA",
  "cor_runtime_commit": "d5737543918c92401ebf5dbff1f0e5c0ef50dc70",
  "cor_package_pin": "REPLACE_WITH_PAGES_WORKFLOW_PACKAGE_SHA",
  "installation_id": "70826f81-a11d-455b-9c33-de7e02303512",
  "configuration_version": "v2",
  "adapter": "noor-demo-static-feed@1.0.0",
  "domain_pack": "noor-eyewear-demo@1.2.0",
  "mapping": "noor-eyewear-catalog@1.2.0",
  "decision_model": "1.1.0",
  "captures": [
    {
      "id": "V01",
      "file": "01-home-desktop.png",
      "device": "REPLACE_WITH_ACTUAL_DEVICE",
      "browser": "REPLACE_WITH_ACTUAL_BROWSER_AND_VERSION",
      "viewport_css_px": "REPLACE_WITH_ACTUAL_WIDTHxHEIGHT",
      "scenario": "home-entry",
      "supporting_workflow_run": null,
      "request_id": null,
      "sha256": "REPLACE_WITH_FILE_SHA256",
      "redaction_checked": true
    }
  ],
  "recording": {
    "file_or_release_asset_url": null,
    "duration_seconds": null,
    "sha256": null,
    "redaction_checked": false
  },
  "limitations": [
    "Demo catalog only; no live inventory, real pricing, orders, or payment.",
    "COR percentages are normalized match scores, not probabilities."
  ]
}
```

Replace every placeholder with observed facts. Remove fields that do not apply rather than inventing values. Add the actual request ID and paired trace for any screen showing a specific recommendation response. Compute SHA-256 after capture and before committing.

## 6. Redaction and integrity checks

Before upload:
- Confirm the capture is from the intended real browser session and actual application URL.
- Remove bearer tokens, cookies, authorization headers, passwords, email/phone/account identifiers, and unrelated tenant data.
- Do not crop away a warning, error, disclaimer, or mismatch that changes the meaning of the screen.
- Preserve original capture files; if redaction is necessary, retain the original privately and publish only the redacted copy.
- Verify filenames, file opens, dimensions, timestamp, SHA-256 and manifest correspondence.
- Do not publish the optional operator view unless all visible data is authorized for public disclosure.

## 7. Acceptance criteria

Gate 4 may be marked PASS only when all of these are true:

- [ ] Every mandatory desktop/mobile capture in Section 3 exists and opens.
- [ ] The captures show the real application, not a mockup or isolated preview mislabeled as deployed.
- [ ] The walkthrough recording exists, plays, and follows the real flow without cuts that conceal failures.
- [ ] Manifest records actual capture date, browser/device, viewport, URL, deployed NOOR SHA, COR runtime/package pins and installation/artifact pins.
- [ ] Recommendation screens can be correlated to the accepted trace/request evidence; visible scores are clearly normalized match scores.
- [ ] Product handoff and demo confirmation visibly retain demo-only boundaries.
- [ ] Redaction review is complete and recorded.
- [ ] Evidence index links every image and the recording asset.
- [ ] COR Issue #266 records the exact commit, file paths, asset URL, SHA-256 values and any remaining limitations.

A missing screenshot, unplayable video, unknown version pin, unredacted secret, or mismatch between visible state and supporting trace keeps Gate 4 OPEN. Automated browser artifacts remain valid supporting evidence but do not replace this visual set.

## 8. Current status and next action

**Current status: NOT CAPTURED.** Repository product photos and browser-test artifacts are not application screenshots. No image or recording is fabricated by this document.

Next action: after the intended Pages build is approved and deployed, capture the matrix above on a real desktop and mobile browser, attach the recording, fill the manifest from observed metadata, and submit the files for evidence review. Until then, Gate 4 remains open.
