# NOOR Documentation Index

Use this directory as the entry point for integration, evidence, and operational documentation.

## Start here

- [NOOR ↔ COR integration operations map](./COR_INTEGRATION_OPERATIONS_MAP_2026-10-30.md) — current Pages source, pinned COR package, live API runtime, staging database/installation, test evidence scope, open PRs, and release blockers.
- [COR Shopper demo integration guide](./COR_SHOPPER_DEMO_INTEGRATION_V1.md) — architecture, configuration, security boundaries, and prerequisites.
- [COR connection incident and runbook](./COR_CONNECTION_INCIDENT_AND_RUNBOOK.md) — initial browser connection failure, changes made, evidence, diagnostic codes, and repeatable verification procedure.
- [COR recommendation trace test guide](./COR_RECOMMENDATION_TRACE_TEST.md) — trace marker, controlled test procedure, required evidence, and closure criteria.

## Evidence

- [2026-10-30 live NOOR/COR browser traces](./evidence/2026-10-30-live-noor-cor-browser-traces.json) — 13 direct COR scenarios plus Chromium/WebKit UI evidence and score/order reconciliation.

## Documentation rules

- Distinguish CI, direct HTTP API smoke, and real-browser UI tests.
- Record the tested commit SHA, deployed runtime SHA, installation/configuration/mapping pins, request IDs, and workflow run.
- A successful recommendation UI smoke does not prove every criteria combination or the accuracy of source product facts.
- API smoke for comparison or handoff is not a real order/payment/checkout test.
- Mark untested operations as unverified; never convert a historical manual test into automated evidence.
- Keep demo-only behavior explicit. This demo is not connected to live NOOR inventory, accounts, cart, checkout, payment, or orders.
- Never commit secrets, bearer tokens, authorization headers, connection strings, or raw credential responses.
