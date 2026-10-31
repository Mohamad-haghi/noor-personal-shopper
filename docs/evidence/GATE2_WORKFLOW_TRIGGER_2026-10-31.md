# Gate 2 workflow trigger — 2026-10-31

Purpose: trigger the existing `NOOR Build Verification` workflow through its documented `pull_request` event targeting `main`, because the GitHub UI did not expose the manual `Run workflow` control.

This is a documentation-only audit commit. It does not change application code, workflow configuration, deployment settings, COR services, Neon, Clerk, or the active COR installation.

Expected evidence from the existing `Live NOOR UI comparison and COR handoff` job:
- workflow job executes against the deployed NOOR Pages site and COR shopper API;
- artifact `noor-live-ui-comparison-handoff` is uploaded with `artifacts/noor-ui-comparison-handoff.json`;
- artifact content is inspected before Gate 2 can be accepted.

A successful build or deploy job alone does not close Gate 2. If the live UI proof job fails or its artifact is missing, Gate 2 remains open and the failure evidence is recorded.

The PR synchronize event is used to request a fresh CI evaluation without changing application behavior.
 verification.
