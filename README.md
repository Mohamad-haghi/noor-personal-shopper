# NOOR Personal Shopper Demo

A Persian-first, right-to-left demo of a product-led shopping journey for the NOOR reference case. This is a **demo/reference implementation** connected to the independently deployed COR Shopper API for demo-only decisioning. It is not a production storefront or a live NOOR systems integration.

## Live demo

- Website: https://mohamad-haghi.github.io/noor-personal-shopper/
- Demo catalog feed: https://mohamad-haghi.github.io/noor-personal-shopper/catalog-feed.json
- COR operator console: https://cor-noor-test.onrender.com/operator-console

The deployed Pages build uses integrated mode for demo-only recommendations, comparisons and product-level handoffs. Controlled live Pages evidence includes Chromium and WebKit checks for the recorded session, recommendation, mandatory-condition zero-results, compare and handoff API scenarios. The saved-choice and demo purchase/handoff journey was previously owner-tested; do not repeat without new evidence. See [current release evidence](docs/RELEASE_EVIDENCE_2026-11-01.md).

## What the demo includes

- Responsive product-led home page, catalog and product detail views.
- A Personal Shopper journey with recommendations, comparison and saved choices.
- Demo purchase/visit handoff and related demo commerce flows.
- A read-only `/manager` presentation view. It is illustrative only; it is **not** a secured production dashboard or real sales analytics.
- Fifteen local demo products and a published demo catalog feed.

## Demo data and safety boundaries

- Catalog, product imagery, availability and commerce behavior are demo/reference data. The feed explicitly marks itself `demoOnly: true`; synthetic availability must not be interpreted as live inventory.
- No live NOOR product, inventory, account, cart, checkout, payment or order system is connected.
- No real purchase or payment is performed. Purchase/visit actions are demo handoffs only.
- Product image provenance and commercial-use rights still require confirmation before commercial customer-facing use.
- Never put a COR secret or static API key in a Vite environment variable. The browser obtains a short-lived, demo-only bearer credential from COR at runtime.

## Environment and installation map

Before changing the COR dependency, a Render service, a Neon database, or a COR installation, read the [COR ↔ NOOR Environment, Branch, and Installation Map](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md). It documents observed branch/deployment pins, service and database links (including what remains unverified), and the distinct roles of installations 745…, 65c9…, and 70826…. Re-check its evidence date against live metadata before acting.

## Architecture

- The app uses the pinned `digital-sales-core` package for canonical domain contracts and bridge logic.
- In integrated mode, recommendation, comparison and handoff bridges call the independently deployed COR Shopper API. The browser must fail safely if COR or a required decision provider is unavailable; it must not silently replace a failed remote decision with locally generated demo recommendations.
- The browser uses the local demo catalog to render product details; COR recommendation responses are resolved back to matching demo products.
- `VITE_NOOR_MODE=integrated` requires `VITE_COR_SHOPPER_BASE_URL` to be a valid HTTPS service origin. `VITE_NOOR_MODE=demo` is the explicit offline/demo composition.

## Run locally

```sh
npm install
npm run dev
```

The Vite development server listens on port 5000. Run checks with:

```sh
npm test
npm run build
```

Copy `.env.example` to `.env` if you need to set the mode explicitly. Do not add secrets to `.env` variables prefixed with `VITE_`, because those values are exposed in the browser bundle.

## Current readiness

The bounded demo engineering acceptance is recorded in [Release Evidence](docs/RELEASE_EVIDENCE_2026-11-01.md): the evidence-gated 15-product feed, recorded live COR recommendation/ranking/no-match scenarios, comparison/handoff API scenarios, and Chromium/WebKit checks passed for the specified cases. This is not production readiness or a security certification.

Important decision rules:
- COR match percentages are normalized match scores, not probabilities.
- The counselor must preserve the user's selected intent; do not filter choices to fit the current 15 products.
- If mandatory conditions have no eligible product, show the no-results state and do not substitute an incompatible product.
- Unknown/conflicting product facts must remain unknown.

## Engineering documentation

Start with the [current project brief](docs/NOOR_CURRENT_PROJECT_BRIEF.md) and [documentation index](docs/README.md).

- [Hero Design Specification V1](docs/HERO_DESIGN_SPEC_V1.md) — approved visual direction and Lovable execution boundary.
- [Current COR Shopper integration guide](docs/COR_SHOPPER_DEMO_INTEGRATION_V1.md) — current demo integration and security boundaries.
- [Release evidence](docs/RELEASE_EVIDENCE_2026-11-01.md) — exact deployed SHAs, workflow runs, test evidence and limitations.
- [COR connection incident and runbook](docs/COR_CONNECTION_INCIDENT_AND_RUNBOOK.md) — historical browser failure and repeatable diagnostic procedure.
- [Documentation archive](docs/archive/README.md) — superseded documents and their replacements.
