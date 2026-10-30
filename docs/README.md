# CURRENT COR INTEGRATION MAP — 2026-10-30

For cross-repository work, the canonical deployment/branch/installation map is maintained in the COR repository:
- [COR ↔ NOOR Environment, Branch, and Installation Map](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md)
- [COR ↔ NOOR Branch and PR Hygiene Register](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_BRANCH_AND_PR_REGISTER_2026-10-30.md)

Current NOOR source facts:
- NOOR Pages source: `main`; the latest audited source commit is `d58ba221122b9124460cd17c267ead53abaaac2c`.
- The Pages workflow pins COR dependency `d306c5efee32707362ac2ee449ef85f95cd876a5` in both build and deploy jobs.
- The public API origin embedded in the integrated build is `https://digital-sales-core.onrender.com`.
- The 15-item catalog, prices and availability are demo-only; there is no live NOOR inventory, order, payment or checkout integration.
- The latest checked-in evidence is `docs/evidence/2026-10-30-live-noor-cor-browser-traces.json`; it contains 13 direct COR scenarios plus separate Chromium and WebKit UI runs. It is bounded scenario evidence, not a general accuracy guarantee.

Do not use old connection incidents or dated checkpoints as the current topology without checking the canonical COR map and exact commit pins.

---

# NOOR Documentation Index

Use this directory as the entry point for integration, evidence, and operational documentation. For cross-repository branch, runtime, database and installation topology, see the canonical COR environment map and branch/PR hygiene register linked below.

## Cross-repository operations

- [COR ↔ NOOR Environment, Branch, and Installation Map](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md)
- [COR ↔ NOOR Branch and PR Hygiene Register](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_BRANCH_AND_PR_REGISTER_2026-10-30.md)

## Integration

- [COR Shopper demo integration guide](./COR_SHOPPER_DEMO_INTEGRATION_V1.md) — architecture, configuration, security boundaries, and prerequisites.
- [COR connection incident and runbook](./COR_CONNECTION_INCIDENT_AND_RUNBOOK.md) — initial browser connection failure, changes made, evidence, diagnostic codes, and a repeatable verification procedure.

## Documentation rules

- Distinguish automated CI checks, direct HTTP endpoint checks, and browser end-to-end tests.
- Record the tested commit SHA and deployment/workflow run when documenting a result.
- Distinguish CI, direct HTTP API smoke, and real-browser UI tests. A successful recommendation UI smoke does not prove all criteria combinations or catalog truth; comparison/handoff API smoke is not an order/payment/checkout test.
- Keep demo-only behavior explicit. Do not describe this demo as connected to live NOOR inventory, accounts, cart, checkout, payment, or orders.
- Never commit secrets, bearer tokens, authorization headers, or raw credential responses.
