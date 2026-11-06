# Lab Experience Adaptation — NOOR-native implementation

**Date:** 2026-11-06  
**Target branch:** `feat/lab-full-experience-adaptation`  
**Implementation status:** First implementation pass committed; automated verification passed on 2026-11-06 (CI run #959).  
**Approval:** User approved implementing the Lab visual experience through the selection-profile summary, with the original NOOR/COR flow beginning at the profile CTA.

## User-approved experience boundary

The Lab presentation applies only to these routes:

1. `/` — full landing page and its informational sections.
2. `/how-it-works` — NOOR-native explanation page.
3. `/catalog` (alias to NOOR `/products`) — collection presentation and filters.
4. `/product/:id` (alias to NOOR `/products/:id`) — product detail presentation.
5. `/shopper` — guided selection questions, using NOOR ShopperFeature.
6. `/profile` — review/editable summary of NOOR's SelectionProfile.

The explicit handoff is the **`مشاهده پیشنهادها`** link on `/profile`, targeting `/recommendations`.

From `/recommendations` onward, the original NOOR route renderers, services, COR recommendation bridge, no-match/unavailable states, ChoicesService, comparison bridge, cart/checkout/payment/confirmation and purchase-handoff behavior remain in control. The Lab presentation shell is removed on those downstream routes.

## Source-of-truth and protected boundaries

- Lab visual reference: `Mohamad-haghi/noor-intelligent-eyewear-studio`, branch `main`, baseline `5de89905c7fb7483e648637472bfd781aedde65f`.
- NOOR source of truth: this repository, with this branch based on the already-merged visual baseline `cb639820e43727b18cb8a4a848f24939f5aba41a`.
- The previous PR #116 only delivered the earlier visual baseline; it did not deliver the complete route experience.
- Do not import or execute Lab's React/TanStack route tree, `src/lib/store.tsx`, `src/lib/catalog.ts`, local mock checkout, or local `recommend()`.
- All product identities, product images, product facts, shopper answers, selection profile, COR requests and downstream flows remain NOOR-owned.
- No COR repository, Render, Neon, Clerk, environment, credentials, service, deployment, database or Pages changes are in scope.
- No merge or Pages publication is authorized by this implementation request.

## First implementation pass

### New NOOR-native views
- `src/ui/render-selection-profile.ts`: reads the existing ShopperFeature journey; presents the profile summary; provides edit links back into the NOOR questionnaire; sends the primary CTA to `/recommendations`.
- `src/ui/render-how-it-works.ts`: adds the Lab-style informational route without using Lab data or local ranking.

### Existing NOOR files adapted
- `src/app/routing/routes.ts`: adds `/profile`, `/how-it-works`, and Lab-compatible aliases `/catalog` and `/product/:id`.
- `src/ui/render-application-shell.ts`: scopes the Lab header/navigation/footer to the pre-handoff routes; retains the original shell on downstream routes; dispatches aliases to existing NOOR catalog/detail renderers; routes profile CTA into the existing recommendation route.
- `src/features/shopper/shopper-feature.ts`: adds a bounded step-navigation method so profile rows can reopen a NOOR question for editing.
- `src/ui/render-shopper.ts`: changes the completed journey's next action to the profile page and preserves GitHub Pages base-path handling.
- `src/ui/render-hero.ts`: composes the full Lab landing hierarchy around NOOR's existing Hero content and NOOR catalog products. The COR explanation avoids claims about local Lab recommendations.
- `src/ui/render-products.ts`: adds collection filters and keeps all cards bound to NOOR products and existing product actions.
- `src/styles.css`: adds a scoped Lab presentation layer for the pre-handoff routes, including white product-image surfaces and responsive layouts.
- `tests/lab-profile-handoff.test.ts`: covers route aliases, profile content, COR handoff, explanatory page and edit-step navigation.
- `tests/hero-presentation.test.ts`: now asserts the additional landing sections.

## Important existing limitation

The current `DemoSelectionProfileProvider` is an in-memory provider. Navigation between NOOR routes in the same SPA session retains the profile, but a full page reload starts a fresh demo profile. This pass intentionally preserves that existing NOOR behavior rather than importing Lab storage or silently changing persistence. Durable cross-reload profile storage is a separate product decision.

## Automated verification completed

Draft PR #117 triggered NOOR Build Verification run #959 on commit `bf2f9255c3ae07ba7058c9bef286909cdd76f72a`.

- Behavioral tests: **155/155 passed** (37 test files).
- TypeScript type-check: passed.
- Vite production build and SPA fallback copy: passed.
- Exact 15-product feed generation and evidence-gated verification: passed.
- Pinned COR build: passed.
- COR Mapping v1.2 integration test against the generated NOOR feed: passed.
- Live browser/COR comparison job: skipped by design; it is only enabled by a separate workflow-dispatch input.

Run: https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/42274325380

## Verification still required

- Owner visual review of the actual browser experience on desktop and mobile.
- Direct route/reload and browser back/forward checks on the deployed Pages URL after separate approval to publish.
- The existing live browser/COR end-to-end proof was not rerun; previously closed live checks remain untouched.
- No merge or Pages publication is authorized by this implementation request.

Acceptance checks:
- Landing page matches the Lab hierarchy on desktop and mobile.
- Product imagery remains on a clean white surface and is not visually dominated by a cream card.
- `/catalog` and `/product/:id` aliases work with the GitHub Pages base path and browser back/forward.
- Shopper answers remain NOOR SelectionProfile data; edit links reopen the correct NOOR step.
- `/profile` primary CTA navigates to the exact NOOR `/recommendations` route.
- Downstream recommendations, COR trace/request IDs, no-match/unavailable, save, compare, and commerce paths are not replaced by Lab code.
- Existing behavior tests, TypeScript, production build and evidence gates pass.
- Owner performs final desktop/mobile visual review before any merge or Pages publish.

No live browser verification, COR retest, merge or deployment is claimed by this implementation pass.
