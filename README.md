# NOOR Personal Shopper

A Persian-first, right-to-left product discovery and personal-shopping demo.

NOOR demonstrates a guided shopping journey: visitors can explore a product catalog, view product details, receive demo recommendations, compare options, save choices, and continue through a demo handoff. The project is presented as a website design and frontend implementation case study.

<sub>**Project status:** Published demo / reference implementation — not a production storefront.</sub>

## Explore the project

- **[Open the live demo](https://mohamad-haghi.github.io/noor-personal-shopper/)**
- [View the source code](https://github.com/Mohamad-haghi/noor-personal-shopper)
- [Read the portfolio case study](PORTFOLIO_SUMMARY.md)

## What is included

- Persian-first, responsive interface with right-to-left layout.
- Home page, product catalog, and product detail views.
- Guided Personal Shopper journey with demo recommendations and product comparison.
- Saved-choice and demo purchase/visit handoff flows.
- A catalog of 15 local demo products and a published demo catalog feed.
- A read-only `/manager` presentation view.

These elements illustrate a possible product-discovery experience. They do not represent a live retailer's operations or customer transactions.

## Scope and limitations

This project is a demonstration/reference implementation for the NOOR concept. It is **not connected to a live NOOR business or commerce system**.

- The 15 products, product information, imagery, availability, and commerce behavior are demo/reference data. The feed explicitly marks itself `demoOnly: true`; availability must not be interpreted as live inventory.
- There is no live product inventory, customer account system, cart, checkout, payment processing, or order management.
- Purchase and visit actions are demo handoffs only; no real purchase or payment takes place.
- The `/manager` view is illustrative. It is not a secured production dashboard and does not show real sales analytics.
- Product image provenance and commercial-use rights must be confirmed before any commercial customer-facing use.
- Recommendation and comparison behavior is bounded to the documented demo scenarios; it should not be presented as a general-purpose or production recommendation service.

## Technical overview

- **Frontend:** Vite and TypeScript.
- **Shared package:** The app uses a pinned `digital-sales-core` package for canonical domain contracts and bridge logic.
- **Demo decisioning:** In integrated mode, recommendation, comparison, and handoff bridges call the independently deployed COR Shopper API.
- **Catalog rendering:** Product details are rendered from the local demo catalog; COR recommendation responses are resolved to matching demo products.
- **Failure behavior:** The browser must fail safely if COR or a required decision provider is unavailable. It must not silently replace a failed remote decision with locally generated demo recommendations.

The browser obtains a short-lived, demo-only bearer credential from COR at runtime. Never place a COR secret or static API key in a Vite environment variable.

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

Copy `.env.example` to `.env` if you need to set the mode explicitly. Do not add secrets to variables prefixed with `VITE_`, because those values are exposed in the browser bundle.

Configuration notes:

- `VITE_NOOR_MODE=integrated` requires `VITE_COR_SHOPPER_BASE_URL` to be a valid HTTPS service origin.
- `VITE_NOOR_MODE=demo` selects the explicit offline/demo composition.

## Testing and readiness evidence

The bounded demo engineering acceptance is recorded in [Release Evidence](docs/RELEASE_EVIDENCE_2026-11-01.md). The documented evidence covers the 15-product feed, specified live COR recommendation/ranking/no-match scenarios, comparison and handoff API scenarios, and Chromium/WebKit checks for the recorded cases.

This evidence is limited to those scenarios. It is **not** a claim of production readiness or a security certification. The saved-choice and demo purchase/handoff journey was previously owner-tested; do not treat that as a newly repeated test.

Important decision rules:

- COR match percentages are normalized match scores, not probabilities.
- The counselor must preserve the user's selected intent; choices must not be filtered merely to fit the current 15 products.
- If mandatory conditions have no eligible product, show the no-results state and do not substitute an incompatible product.
- Unknown or conflicting product facts must remain unknown.

## Project documentation

For the current project scope and implementation details, see:

- [Current project brief](docs/NOOR_CURRENT_PROJECT_BRIEF.md)
- [Documentation index](docs/README.md)
- [Hero Design Specification V1](docs/HERO_DESIGN_SPEC_V1.md) — approved visual direction and Lovable execution boundary
- [Current COR Shopper integration guide](docs/COR_SHOPPER_DEMO_INTEGRATION_V1.md) — demo integration and security boundaries
- [Release evidence](docs/RELEASE_EVIDENCE_2026-11-01.md) — exact deployed SHAs, workflow runs, test evidence, and limitations
- [COR connection incident and runbook](docs/COR_CONNECTION_INCIDENT_AND_RUNBOOK.md) — historical browser failure and repeatable diagnostic procedure
- [Documentation archive](docs/archive/README.md) — superseded documents and their replacements

Before changing the COR dependency, a Render service, a Neon database, or a COR installation, read the [COR ↔ NOOR Environment, Branch, and Installation Map](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md). It documents observed branch/deployment pins, service and database links (including what remains unverified), and distinct installation references. Re-check its evidence date against live metadata before acting.
