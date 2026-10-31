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
- Therefore execution and artifact inspection remain **pending independent GitHub Actions evidence**. Gate 2 remains open until the run and JSON artifact are verified.

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

