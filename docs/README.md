# NOOR Documentation Index

Use this directory as the entry point for integration and operational documentation.

## Integration

- [COR Shopper demo integration guide](./COR_SHOPPER_DEMO_INTEGRATION_V1.md) — architecture, configuration, security boundaries, and prerequisites.
- [COR connection incident and runbook](./COR_CONNECTION_INCIDENT_AND_RUNBOOK.md) — initial browser connection failure, changes made, evidence, diagnostic codes, and a repeatable verification procedure.

## Documentation rules

- Distinguish automated CI checks, direct HTTP endpoint checks, and browser end-to-end tests.
- Record the tested commit SHA and deployment/workflow run when documenting a result.
- Mark untested operations as unverified; a working recommendation flow does not prove comparison or handoff.
- Keep demo-only behavior explicit. Do not describe this demo as connected to live NOOR inventory, accounts, cart, checkout, payment, or orders.
- Never commit secrets, bearer tokens, authorization headers, or raw credential responses.
