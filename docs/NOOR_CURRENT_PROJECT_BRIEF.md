# NOOR — Current Project Brief

**Status date:** 2026-11-03  
**Source of truth:** `main` branch of `Mohamad-haghi/noor-personal-shopper`  
**Purpose:** single current product and engineering brief for contributors, designers and AI agents.

## 1. Product definition

NOOR is a Persian-first, RTL eyewear personal-shopper demo/reference experience. It demonstrates guided product discovery and COR-backed decision intelligence within a bounded demo environment. It is not a live NOOR retail storefront.

## 2. Current delivery boundary

### Included and evidenced
- Public GitHub Pages demo: https://mohamad-haghi.github.io/noor-personal-shopper/
- 15-product demo catalog and public demo feed.
- Guided shopper, selection profile, recommendations, saved choices, comparison, product details and demo handoff/purchase journey.
- COR Shopper integration for demo recommendations, comparisons and product-level handoff within the recorded scenarios.
- Build, deployment, catalog-feed and controlled browser/API evidence recorded in [Release Evidence](./RELEASE_EVIDENCE_2026-11-01.md).

### Explicitly not included
- Real NOOR inventory, pricing, accounts, cart, checkout, payment or orders.
- Real purchases or payment processing.
- Production-secured manager dashboard or real sales analytics.
- Face scanning, virtual try-on or guaranteed fit.
- Production security certification.

Product image provenance and commercial-use rights remain to be confirmed before commercial customer-facing use.

## 3. Product and decision-engine rules

- COR match percentages are normalized match scores, not purchase probabilities.
- Unknown or conflicting product facts must remain unknown; never infer or fabricate product attributes.
- The counselor must preserve the customer's selected intent. Do not remove or dynamically restrict choices merely because the current 15-item demo catalog lacks a match.
- A valid hard-constraint no-match must be communicated clearly; do not substitute an incompatible product.
- Do not repeat previously owner-tested save/compare/demo-purchase flows without contradictory evidence or a specific new change requiring regression testing.
- Demo catalog availability and commerce values are illustrative only.

## 4. Current architecture and source of truth

| Area | Canonical source | Rule |
|---|---|---|
| Product code and UI | This GitHub repository, `main` | Changes through scoped branches and reviewed PRs |
| Release/test evidence | `docs/RELEASE_EVIDENCE_2026-11-01.md` | Record exact source SHA and workflow/deployment evidence |
| COR integration contract | `docs/COR_SHOPPER_DEMO_INTEGRATION_V1.md` | Demo-only boundary; no secrets in browser |
| COR infrastructure topology | [COR environment topology](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md) | Read before any COR/Render/Neon/Clerk/install change |
| Visual implementation prototype | Lovable project “NOOR Intelligent Eyewear Studio” | Design/prototyping only until explicitly reconciled with this repo |
| Legacy project experiments | Replit checkout | Stale; do not use as implementation source |

Lovable project: https://lovable.dev/projects/97a9b5bd-e074-4443-b306-3eae89669d87  
Lovable preview: https://id-preview--97a9b5bd-e074-4443-b306-3eae89669d87.lovable.app

The current Lovable project is an independent prototype with local deterministic mock data. It is not connected to COR, production inventory or commerce. GitHub remains the implementation source of truth. Do not publish Lovable as the production NOOR site.

## 5. Current presentation phase

The next bounded workstream is customer-facing visual presentation, beginning with the home-page Hero. The approved design direction and implementation acceptance criteria are in [Hero Design Specification V1](./HERO_DESIGN_SPEC_V1.md).

Lovable may implement the visual specification only. It must not:
- change product facts, catalog IDs or product image paths;
- alter shopper questions, selection intent, COR requests, scoring, recommendation ordering or no-match behavior;
- introduce a new backend, database, authentication, payment or commerce integration;
- publish or replace the public GitHub Pages site;
- add unsupported claims such as live stock, real prices, guaranteed fit, AI face analysis or virtual try-on.

After a Lovable visual iteration, compare it with this specification and port only approved visual changes into a fresh GitHub branch/PR. No direct Lovable-to-main merge.

## 6. Change and documentation control

1. Read this brief and the documentation index before work.
2. Confirm the target branch and latest deployed SHA; never assume `main` is the deployed source.
3. Make one bounded change per branch/PR.
4. Keep historical evidence in place; move superseded guidance to `docs/archive/` with a clear replacement link.
5. Update the current index and relevant status document in the same documentation change.
6. Record what changed, what did not change, exact evidence, and remaining limitations.
7. Do not touch COR infrastructure or installations for visual-only work.

## 7. Current known facts and open checks

- The latest release evidence records NOOR Pages source commit `b4a03ac383435296562d96f94db4a901f4b82e86` and Pages workflow run [41460220608](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41460220608).
- The current GitHub `main` documentation snapshot observed on 2026-11-03 is `b3fa322afde4457965b3e30d5e4561047ca98eba`; documentation commits do not by themselves change the deployed Pages app.
- The current Lovable project preview is available but is a separate prototype; its build and visual result must be independently reviewed before reuse.
- A full visual acceptance review of the live GitHub Pages site across mobile and desktop remains separate from the previously completed API/engineering acceptance.
- Image commercial-use rights remain open.

## 8. Authority order when records disagree

1. Current code on GitHub `main` for implemented behavior.
2. Latest successful workflow/deployment evidence for what is actually deployed.
3. Current release evidence for test outcomes and limitations.
4. This brief and the current integration guide for operating rules.
5. Archived documents only for historical context.

If a discrepancy is found, do not guess. Record it and reconcile the documents against code and deployment evidence.
