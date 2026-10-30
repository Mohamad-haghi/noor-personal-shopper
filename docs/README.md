# CURRENT COR INTEGRATION MAP — 2026-10-30

For cross-repository work, the canonical deployment/branch/installation map is maintained in the COR repository:
- [Current COR ↔ NOOR Environment and Branch Map — PR #308](https://github.com/Mohamad-haghi/digital-sales-core/pull/308)
- [Current COR ↔ NOOR Branch and PR Hygiene Register — PR #308](https://github.com/Mohamad-haghi/digital-sales-core/pull/308/files)
- After PR #308 merges, these documents will be available on COR `main` at `docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md` and `docs/COR_NOOR_BRANCH_AND_PR_REGISTER_2026-10-30.md`.

Current NOOR source facts:
- NOOR Pages source: `main`; the latest audited source commit is `d58ba221122b9124460cd17c267ead53abaaac2c`.
- The Pages workflow pins COR dependency `d306c5efee32707362ac2ee449ef85f95cd876a5` in both build and deploy jobs.
- The public API origin embedded in the integrated build is `https://digital-sales-core.onrender.com`.
- The 15-item catalog, prices and availability are demo-only; there is no live NOOR inventory, order, payment or checkout integration.
- The latest checked-in evidence is `docs/evidence/2026-10-30-live-noor-cor-browser-traces.json`; it contains 13 direct COR scenarios plus separate Chromium and WebKit UI runs. It is bounded scenario evidence, not a general accuracy guarantee.

**15-product catalog source audit:** [NOOR Demo Catalog Source Audit — 2026-10-30](NOOR_DEMO_CATALOG_SOURCE_AUDIT_2026-10-30.md). It compares exact SKU variants with NOOR Optic pages and independent product sources; it is evidence-only and does not change catalog records.

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

- Separate automated CI, direct HTTP API smoke, and real-browser UI tests; record exact source/runtime SHAs, installation pins, request IDs and workflow runs.
- A successful recommendation UI smoke does not prove all criteria combinations or catalog truth; comparison/handoff API smoke is not an order/payment/checkout test.
- Keep demo-only behavior explicit. Do not describe this demo as connected to live NOOR inventory, accounts, cart, checkout, payment, or orders.
- Never commit secrets, bearer tokens, authorization headers, or raw credential responses.
