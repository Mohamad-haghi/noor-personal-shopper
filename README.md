# NOOR Personal Shopper Demo

A Persian-first, right-to-left demo of a product-led shopping journey for the NOOR reference case. This is a **demo/reference implementation** connected to the independently deployed COR Shopper API for demo-only decisioning. It is not a production storefront or a live NOOR systems integration.

## Live demo

- Website: https://mohamad-haghi.github.io/noor-personal-shopper/
- Demo catalog feed: https://mohamad-haghi.github.io/noor-personal-shopper/catalog-feed.json
- COR operator console: https://cor-noor-test.onrender.com/operator-console

The deployed Pages build uses integrated mode and calls the COR Shopper API at https://digital-sales-core.onrender.com. The 2026-10-30 Pages workflow passed live HTTP smoke checks for demo-session, recommendations, comparison, and demo product-detail handoff; its Chromium/WebKit browser smoke validates the recommendation journey. These checks do not verify real inventory, order creation, payment, or commercial checkout. See the [current COR integration evidence and operations map](docs/COR_INTEGRATION_OPERATIONS_MAP_2026-10-30.md) for exact SHAs, run IDs, and evidence limits.

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
- Do not connect real customer data or change a live customer site without explicit approval and a verified secure COR runtime.
- Product image provenance and commercial-use rights still require confirmation before customer-facing commercial use.
- Never put a COR secret or static API key in a Vite environment variable. The browser obtains a short-lived, demo-only bearer credential from COR at runtime.

## Environment and installation map

Before changing the COR dependency, a Render service, a Neon database, or a COR installation, read the [current COR environment and branch map](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_ENVIRONMENT_TOPOLOGY_V1.md) and [branch/PR hygiene register](https://github.com/Mohamad-haghi/digital-sales-core/blob/main/docs/COR_NOOR_BRANCH_AND_PR_REGISTER_2026-10-30.md). They distinguish the NOOR Pages package pin from the live COR API runtime, identify the staging installation and protected historical baseline, and mark unverified infrastructure links. Re-check live metadata before acting.

## Architecture

- The app uses the pinned `digital-sales-core` package for canonical domain contracts and bridge logic.
- In integrated mode, the recommendation, comparison and handoff bridges call the independently deployed COR Shopper API. The browser must fail safely if COR or a required decision provider is unavailable; it must not silently replace a failed remote decision with locally generated demo recommendations.
- The browser uses the local demo catalog to render product details; COR's recommendation response is resolved back to the matching demo product.
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

## Readiness status

The integrated recommendation bridge omits Persian presentation-only use-case labels from COR requests until an explicit canonical mapping exists; useCase is context-only and does not affect the current score. The 2026-10-30 Pages workflow has passed live HTTP smoke checks for demo-session, recommendations, a hard-constraint no-match control, comparison, and demo product-detail handoff. Its Chromium/WebKit browser smoke validates the recommendation UI journey and displayed score/order against the COR response. This is evidence for the tested demo path only, not general recommendation accuracy or production readiness. The catalog facts still require exact-SKU source verification. No real inventory, order creation, payment, or commercial checkout is connected. Before commercial production use, replace demo data and demo credentials with an approved tenant/source configuration and complete security, privacy, image-rights, monitoring, and operational reviews.

## Engineering documentation

- [Documentation index](docs/README.md)
- [COR connection incident and verification runbook](docs/COR_CONNECTION_INCIDENT_AND_RUNBOOK.md) — original browser failure, fix history, diagnostic codes, and the checklist for future installations.
- [COR Shopper integration guide](docs/COR_SHOPPER_DEMO_INTEGRATION_V1.md)
