# NOOR Documentation Index

Use this directory as the entry point for integration, release evidence and operational documentation. Start with [current release evidence](./RELEASE_EVIDENCE_2026-11-01.md) before changing code or repeating a test.

## Integration

- [COR Shopper demo integration guide](./COR_SHOPPER_DEMO_INTEGRATION_V1.md) — architecture, configuration, security boundaries, and prerequisites.
- [COR connection incident and runbook](./COR_CONNECTION_INCIDENT_AND_RUNBOOK.md) — initial browser connection failure, changes made, evidence, diagnostic codes, and a repeatable verification procedure.

## Current status and evidence

- [Release evidence 2026-11-01](./RELEASE_EVIDENCE_2026-11-01.md) — deployed SHAs, PR #105/#106, Pages run, live browser evidence, current limitations.

## Documentation rules

- Distinguish automated CI checks, direct HTTP endpoint checks, and browser end-to-end tests.
- Record the tested commit SHA and deployment/workflow run when documenting a result.
- Distinguish controlled live API/browser scenarios from owner-tested demo journey behavior; use the dated release evidence for current PASS/OPEN boundaries.
- Keep demo-only behavior explicit. Do not describe this demo as connected to live NOOR inventory, accounts, cart, checkout, payment, or orders.
- Never commit secrets, bearer tokens, authorization headers, or raw credential responses.
