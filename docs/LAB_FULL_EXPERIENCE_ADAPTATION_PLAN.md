# Lab Full-Experience Adaptation Plan

**Date:** 2026-11-06  
**Target branch:** `feat/lab-full-experience-adaptation`  
**Status:** Route inventory and architecture comparison started; implementation not yet verified.  
**Approval:** Owner explicitly requested the full Lab presentation experience in NOOR while retaining NOOR's original end-to-end flows.

## Goal

When a visitor opens NOOR, the visible site should reproduce the complete Lab presentation experience (not only the palette and Hero), while every operational action continues through NOOR's existing application services, providers, router, catalog, COR bridges, and demo commerce/handoff flow.

This is an adaptation, not a repository merge. Lab is the presentation reference; NOOR main is the sole source of truth for behavior and data.

## Pinned source baseline

- Lab `main`: `5de89905c7fb7483e648637472bfd781aedde65f`
- NOOR `main` before this branch: `cb639820e43727b18cb8a4a848f24939f5aba41a`
- Previous visual-only PR #116 is already merged at `cb639820e43727b18cb8a4a848f24939f5aba41a`; it changed six files and did not transfer the full Lab page/route experience.
- Lab Hero asset `public/hero-1024-q65.webp` and NOOR Hero asset `public/media/hero/hero-1024-q65.webp` have the same Git blob SHA `c2326ad35541ad3d363dae2d93c6cc47a9a17338`. They are byte-identical; the currently observed old Hero is not explained by a different source asset. Investigate deployment/cache and composition before replacing artwork.

## Architecture boundary

- Lab uses React + TanStack Router + a local mock catalog/store.
- NOOR uses its own TypeScript router, imperative renderers, feature/service/provider layers, and COR recommendation/comparison/purchase-handoff bridges.
- Do not import Lab's `src/lib/catalog.ts`, `src/lib/store.tsx`, route tree, mock recommendation engine, mock checkout state, or React/TanStack runtime.
- Rebuild Lab's visual hierarchy in NOOR-native renderers/CSS and bind displayed product/recommendation content to NOOR services and COR outputs.

## Page and route correspondence

| Lab page | NOOR route/target | Adaptation boundary |
|---|---|---|
| `/` full landing page | `/` | Rebuild all Lab landing sections (Hero, three-step explanation, curated product presentation, COR decision-intelligence explanation/flow diagram, final CTA) using NOOR Hero content, NOOR catalog products, and truthful COR-connected claims. Do not use Lab mock products or local ranking. |
| `/how-it-works` | New informational page only if needed; otherwise home sections | Visual/informational content may be adapted. Claims must accurately describe current NOOR/COR integration; no invented capabilities. |
| `/catalog` | `/products` | Reuse NOOR catalog service, 15-product feed, product IDs, filters/facts and existing product actions. |
| `/product/$id` | `/products/:id` | Keep NOOR product identity, attributes, images, variants, save/compare and selection actions. |
| `/shopper` | `/shopper` | Keep NOOR ShopperFeature, question schema, mandatory criteria, persistence and navigation. Transfer only layout/visual language. |
| `/profile` | NOOR selection-profile state and relevant existing route(s) | Lab's local answer model is not portable. Preserve NOOR's selection-profile service and edit/review semantics; add a route only if NOOR's existing route map lacks an equivalent and the full flow requires it. |
| `/recommendations` | `/recommendations` | COR remains authoritative for recommendations, reasons, scores, no-match and unavailable states. Never use Lab's local `recommend()`. |
| `/saved` | `/choices` | Keep NOOR ChoicesService/provider and recommendation-to-choice identity. |
| `/compare` | `/compare` | Keep NOOR comparison service and COR comparison bridge; do not use Lab's local compare state. |
| `/checkout` (Lab visit handoff mock) | NOOR `/visit` for visit intent; NOOR `/cart` → `/checkout` → `/payment` → `/confirmation/:id` remains intact | Do not replace NOOR checkout with Lab's fictional visit page. Preserve the complete NOOR demo commerce flow and purchase-handoff contract. |
| `/manager` | `/manager` | Keep NOOR's truthful demo manager view and data sources; adapt visual presentation only. |

NOOR-only routes that have no Lab equivalent and must remain reachable and functional: `/search`, `/account`, `/cart`, `/checkout`, `/payment`, `/confirmation/:id`, `/branches`, and `/visit`.

## Non-negotiable invariants

1. NOOR route resolution, app-link navigation and browser history behavior remain intact.
2. NOOR catalog feed, 15 product identities, product facts and image URLs remain canonical.
3. Shopper questions, mandatory criteria, selection profile persistence and edit flow remain canonical.
4. COR request/response contracts, ranking, reasons, normalized match score, trace marker, no-match and unavailable states remain unchanged.
5. Save/choices, compare, cart, checkout, payment, confirmation, branch and visit flows remain NOOR-owned.
6. Demo disclaimers remain accurate; no real inventory, pricing, orders, payment or store booking claims.
7. No COR repository, Render, Neon, Clerk, environment, credentials, deployment or database changes.
8. No merge or Pages publication without separate owner approval.

## Implementation sequence

1. Finish route-level visual inventory and inspect current NOOR landing/navigation structure.
2. Implement the complete Lab-style landing page in NOOR-native code, with NOOR data and destinations.
3. Adapt shared header/footer/navigation and page-level visual language.
4. Adapt catalog/detail/shopper/profile/recommendations/choices/compare/manager and the relevant visit handoff presentation one route at a time.
5. Verify NOOR-only cart/checkout/payment/confirmation/account/branch/search routes remain operational and visually coherent.
6. Run targeted tests, type-check, production build, existing behavioral/evidence gates and the relevant COR integration checks.
7. Provide a preview for owner visual review on desktop and mobile. Do not merge or publish before approval.

## Known verification limits at start

- The previous PR #116 CI success does not prove every Lab page has been reproduced.
- The previously reported browser assertion timeout at `.product-card` remains separately unresolved until reproduced or closed with exact evidence.
- Repository asset SHA equality proves the Hero files are identical, but does not prove which deployed Pages build or cached asset a browser currently displays.
- No browser visual review or live end-to-end retest is claimed by this plan.
