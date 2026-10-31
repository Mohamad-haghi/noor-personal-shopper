# Gate 2 workflow trigger — 2026-10-31

## Purpose

Run the existing live NOOR UI comparison and COR product-handoff proof job without merging audit changes into `main`, changing deployment infrastructure, or weakening repository security settings.

## Confirmed cause of the empty push runs

The workflow's original `push` trigger allowed only `main`. Commits pushed to the audit branch therefore created workflow runs with no jobs. The `pull_request` trigger targeting `main` was present, but GitHub did not register a PR event for PR #100 during the earlier attempts. The exact reason for the missing PR event remains unconfirmed; no claim is made that GitHub App token suppression caused it.

## Controlled branch-only trigger

The workflow on this audit branch now allows `push` on:
- `main` (unchanged)
- `audit/gate2-live-ui-proof-trigger-20261031` (temporary audit-only path)

This does not change the workflow trigger on `main` and does not cause a production Pages deployment. It enables the existing `NOOR Build Verification` workflow to evaluate the audit-branch workflow file and execute its existing jobs.

Trigger change commit: `e84a3fd5decbe5ab60559acd1744e9dfe47e1cc2`.

## Expected evidence

The existing `Live NOOR UI comparison and COR handoff` job must:
1. Open the deployed NOOR Pages site.
2. Generate at least two recommendations.
3. Compare those exact two product IDs through the COR comparison endpoint and verify the UI/API contract.
4. Create and verify the demo product handoff through COR, including the expected NOOR destination.
5. Upload `noor-live-ui-comparison-handoff` containing `artifacts/noor-ui-comparison-handoff.json`.

The JSON artifact must be downloaded and inspected. A queued run, a successful generic build, or a successful Pages deployment alone does not close Gate 2.

## Current audit status

- Trigger configuration change: committed on the audit branch.
- No merge to `main`; no Render, Neon, Clerk, credential, catalog, or active COR installation changes.
- The GitHub connector available in this session does not expose a list-workflow-runs operation for push events. Its commit-run lookup filters to pull-request events, so it cannot independently verify the push run or retrieve its run ID.
- Execution and artifact inspection are now complete for diagnostic runs #781/#782; the comparison passed, but the handoff UI assertion failed for a confirmed destination-origin mismatch. Gate 2 remains OPEN.

## Cleanup rule

After successful verification, update this record with the run URL/ID, job result, artifact ID, inspected JSON summary, and final Gate 2 disposition. Then remove this temporary audit-branch push allowance in a follow-up commit or close the audit PR after preserving the evidence in the canonical project records. Do not merge the temporary trigger into `main` unless a separate explicit release decision requires it.

## Follow-up: run #775 YAML validation failure

GitHub Actions run #775 evaluated workflow revision `424d69f` and rejected it before job execution because of invalid YAML indentation at line 55, at the Chromium installation step. This is a workflow syntax/configuration failure, not a failed product test.

The current audit-branch workflow file has the step correctly structured as:

```yaml
      - name: Install Chromium
        run: "$RUNNER_TEMP/noor-playwright/node_modules/.bin/playwright" install --with-deps chromium
```

The corrected workflow is present on the audit branch. A subsequent run must confirm GitHub accepts the YAML and starts the jobs. Gate 2 remains OPEN until the live UI proof job succeeds and its JSON artifact is inspected.



## Diagnostic result: runs #781 and #782

- Workflow revision: `86638c3bcca96de11404a3313ae1d2a9f55cc43a`.
- Push run #781: [41188008447](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41188008447).
- Pull-request run #782: [41188012336](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41188012336).
- Build job passed; behavioral tests and type-check/build passed.
- Chromium and Playwright setup passed.
- Browser proof confirmed three recommendation cards, two selected product IDs, comparison UI table, and matching COR comparison response (HTTP 200, `cor_canonical_engine`, `demoOnly=true`).
- COR handoff response also succeeded (HTTP 200, `cor_canonical_engine`, `demoOnly=true`). Its destination origin was `https://mohamad-haghi.github.io`, resolving to the NOOR Pages demo product-detail path.
- The deployed NOOR UI still required `https://www.nooroptic.com` and therefore did not render the approved demo-store link. The demo cart notice remained visible; no browser page errors were recorded.
- Artifact #13037781249 from run #781 was downloaded and inspected. It records `storeLinkVisible=false`, the returned destination origin, and the UI status. The comparison and handoff API results are distinct and must not be conflated.

## Corrective proposal tracked separately

Draft NOOR PR #101:
https://github.com/Mohamad-haghi/noor-personal-shopper/pull/101

The proposed UI guard allows only HTTPS, the current NOOR Pages origin, and the exact product-detail path for the selected product. The browser assertion is aligned to that same destination. COR's server-side approved-origin policy remains unchanged. PR #101 is draft and unmerged; no Pages deployment or live configuration change has occurred.

## Current Gate 2 disposition

**PARTIAL — comparison proven; COR handoff API proven; customer-facing handoff link not yet proven.**

Gate 2 stays OPEN until PR #101 is reviewed, explicitly approved and deployed, then a fresh live browser run passes and its artifact is inspected. Do not weaken the origin/path assertions or claim a completed purchase.