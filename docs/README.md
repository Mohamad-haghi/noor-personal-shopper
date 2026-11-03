# NOOR Documentation Index

**Last reconciled:** 2026-11-03  
This is the entry point for current product direction, engineering rules, integration, release evidence and historical records. Start with the [current project brief](./NOOR_CURRENT_PROJECT_BRIEF.md), then consult the specific document for the work you intend to do.

## Current product and design

- [Current Project Brief](./NOOR_CURRENT_PROJECT_BRIEF.md) — product boundary, source-of-truth hierarchy, current delivery status, operating rules and next phase.
- [Hero Design Specification V1](./HERO_DESIGN_SPEC_V1.md) — approved home Hero design and strict Lovable implementation scope.

## Integration and operations

- [Current COR Shopper integration guide](./COR_SHOPPER_DEMO_INTEGRATION_V1.md) — deployed demo architecture, current verified boundaries, security rules and operational guardrails.
- [COR connection incident and runbook](./COR_CONNECTION_INCIDENT_AND_RUNBOOK.md) — historical browser connection incident, diagnostic codes and repeatable verification procedure.
- [COR ↔ NOOR Environment, Branch, and Installation Map](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md) — canonical COR-side infrastructure map; read before any COR/Render/Neon/Clerk/install change.

## Current release and evidence

- [Release Evidence](./RELEASE_EVIDENCE_2026-11-01.md) — deployed source pins, PRs, workflow runs, runtime/browser evidence and explicit limitations.

## Historical archive

- [Archive index](./archive/README.md) — superseded guidance retained for traceability. Archived files are not current instructions.

## Documentation governance

1. GitHub `main` is the source of truth for NOOR code and approved project documentation.
2. Lovable is a separate visual prototype/execution environment; it is not the production source of truth.
3. Replit's old checkout is stale and must not be used as an implementation base.
4. Keep dated test evidence traceable. Do not silently rewrite historical PASS/FAIL records.
5. When guidance becomes obsolete, copy it to `docs/archive/`, add an archive notice and replacement link, then update the active document and this index.
6. Distinguish CI, direct HTTP checks and browser end-to-end tests.
7. Record exact source SHA, workflow/deployment run and scope for every new verification claim.
8. Keep demo-only behavior explicit. Never claim live NOOR inventory, real accounts, checkout, payment or orders.
9. Never commit secrets, bearer tokens, authorization headers or raw credential responses.
