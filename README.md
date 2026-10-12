# NOOR Personal Shopper Demo

A Persian-first, right-to-left demo of a product-led shopping journey for the NOOR reference case. This is a **demo/reference implementation**, not a live NOOR integration or production storefront.

## What the demo currently includes

- Responsive product-led home page, catalog and product detail views.
- A Personal Shopper journey with recommendations, comparison and saved choices.
- Demo purchase/visit handoff and related demo commerce flows.
- A read-only `/manager` presentation view. It is illustrative only; it is **not** a secured production dashboard or real sales analytics.
- Fifteen local demo product images wired into the demo catalog.

All demo prices and availability are hypothetical and must be presented as demo-only. Product image provenance and commercial-use rights still require confirmation before customer-facing commercial use.

## Important integration boundary

- The demo uses the pinned `digital-sales-core` package in-process for canonical decision/comparison/handoff bridges, against demo product data.
- It does **not** call an independently deployed COR Shopper API.
- It does **not** connect to NOOR's live product, inventory, account, cart, checkout, payment or order systems.
- `VITE_NOOR_MODE=integrated` is reserved for a later phase and must fail explicitly. It must not silently fall back to demo providers.
- Do not connect real customer data or change a live customer site without explicit approval and a verified secure COR runtime.

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

## Configuration

Copy `.env.example` to `.env` if you need to set the mode explicitly. `VITE_NOOR_MODE` defaults to `demo`; `integrated` is not currently a supported live connection mode.

## Architecture guardrails

Keep UI, feature/service logic, and provider boundaries separate. Reuse the canonical COR decision engine; do not add an independent recommendation/ranking fallback. If COR or a required decision provider is unavailable, show the safe unavailable state instead of inventing results or silently substituting demo data.
