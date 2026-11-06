# NOOR Main Demo — Lab Visual Assembly Review

**Review date:** 2026-11-06  
**Status:** Read-only review completed; visual transfer plan recorded; no application code changed.  
**Purpose:** Make the existing NOOR demo the single presentation demo, using only the approved visual language from the Lab repository.

## 1. Controlling decision

The main demo remains **NOOR Personal Shopper**. The Lab repository is a visual reference only.

Transfer only approved presentation properties: palette, typography treatment, spacing, surfaces, borders, image presentation, hover/focus feedback, and the approved Hero composition. Keep NOOR's routes, DOM ownership, content, catalog, product identifiers, state, persistence, recommendation flow, COR API contract, trace behavior, and demo handoff unchanged.

This is a selective visual adaptation, **not** a repository merge, application replacement, or port of Lab functionality.

## 2. Reviewed source pins

| Repository | Reference | Commit |
|---|---|---|
| NOOR main application | `main` | `99f9ae387eabccd6948ab135639108d7d0e89235` |
| Lab visual reference | `main` | `5de89905c7fb7483e648637472bfd781aedde65f` |
| COR dependency reference | `main` | `94105719d8f6a770dfc497a95094367ac6bc08ae` |

Lovable project was read through `get_project` and reported `latest_commit_sha=5de89905c7fb7483e648637472bfd781aedde65f`, with project ready and agent finished. This confirms the Lab source pin used for this review; it does not authorize Lovable edits or publishing.

The protected Lab branch `docs/engineering-audit-baseline` is not a transfer source and must remain untouched. Do not merge Lab main, the audit-baseline branch, or old NOOR hero experiment branches into NOOR main.

## 3. Architecture compatibility finding

NOOR and Lab are not component-compatible:

- NOOR main is a TypeScript application with imperative render functions in `src/ui/render-*.ts`, a dedicated `src/ui/hero.css`, global `src/styles.css`, and a demo Hero provider.
- Lab is a React/TanStack application using Tailwind utilities, React components, and a local mock store/catalog.
- Lab's `src/components/noor.tsx`, route components, hooks, and store are therefore **not drop-in replacements** for NOOR files.
- Lab's complete `src/styles.css` must not be copied: it contains Tailwind imports, generated theme declarations and utility definitions that do not match NOOR's styling/runtime setup.

The implementation must preserve NOOR's existing markup/rendering and apply the Lab visual decisions through NOOR-native CSS and narrowly scoped presentation markup changes where necessary.

## 4. Visual transfer map

| Lab visual source | Lab evidence | NOOR target | Transfer classification | Boundary / validation |
|---|---|---|---|---|
| Quiet Luxury palette | Lab `src/styles.css`; palette commit `0079d6f528cc9a4a567ef29b0ed70ba1ad7f81b6` | `src/styles.css` | CSS token adaptation only | Map Ivory/Limestone/Sand/Bronze/Charcoal to NOOR's existing CSS variables. Preserve distinct semantic COR match/mismatch/unknown colors; check text contrast and all routes. Do not paste Tailwind theme. |
| Hero composition and image treatment | Lab `src/styles.css` and `src/routes/index.tsx`; Lab hero asset `public/hero-1024-q65.webp`; approved visual source pin above | `src/ui/hero.css`, `src/ui/render-hero.ts`; existing `src/providers/demo/demo-hero-provider.ts` and its current media source remain authoritative | CSS plus narrowly scoped markup adaptation | Preserve NOOR's dynamic HeroContent, escaped text, route-aware CTA destination, `data-app-link`, existing Ray-Ban asset and image identity. Do not replace provider/content with Lab hard-coded data. Desktop/mobile placement must match the approved composition; no image card/frame around the Hero image. |
| Product image treatment | Lab `src/components/noor.tsx`; commit `39b5e323e66caf9130e24500e32c057891a41b1d` | `src/ui/render-products.ts`, `src/ui/render-recommendations.ts`, and product/choice/compare image renderers only where present | CSS-only first; markup only if required | White image surface, remove excess inner padding, retain `object-fit: contain`; do not crop or change source URLs, product identity, or image provenance. NOOR product images are generated from domain data, not Lab catalog objects. |
| Card, border, spacing and type hierarchy | Lab `src/components/noor.tsx`, `src/routes/catalog.tsx`, `src/routes/compare.tsx`, `src/routes/profile.tsx` | Existing NOOR page CSS and renderers, including `src/ui/render-products.ts`, `render-recommendations.ts`, `render-choices.ts`, `render-compare.ts`, `render-account.ts`, and their existing page classes | CSS adaptation, page by page | Translate the visual system, not React components or content. Keep all existing actions, forms, routes, labels, facts and empty/error states. |
| Hover, focus and cursor feedback | Lab commits `e4b61c7aff0370eb6ec1e5e0844664971b5e9006`, `2beb2d82c166974fbeb0e7f969a569a29a677838`, `75ab362e1a1a119bef690266d68adfc33c9d2359` | Existing NOOR global and component/page CSS | CSS-only | Preserve keyboard focus visibility, disabled states and reduced-motion behavior. Do not alter click handlers or action semantics. |
| Latin step numbers | Lab commit `aa656a00aacd32a8411ce8923d8fcf4c07c246b4` | NOOR home page only if the corresponding numbered visual section exists | Content/presentation decision; not an automatic port | Keep only if the same numbered section exists in NOOR and the change is purely typographic. Do not import Lab's home content or curated products. |

### Lab changes explicitly excluded

- Lab `src/lib/catalog.ts`, `src/lib/store.tsx`, shopper logic, route definitions and local state.
- Lab curated home selection commit `a16e4135bbe36ffdf49aac68c8028b04e39c5337` and its related catalog test commit `87e33e780e3debdea94c58eac1dda37b86264ae5`. NOOR's own catalog and product set remain authoritative.
- Any Lab-only profile, catalog, compare, save, recommendation or checkout behavior.
- Any changes to product IDs/SKUs, source image URLs, demo feed, COR payloads, score interpretation, trace/request IDs, no-match handling, persistence, or integration credentials.
- Lab branch merges, broad cherry-picks, and wholesale CSS replacement.

## 5. NOOR-native implementation targets

The relevant NOOR files were confirmed to exist on the reviewed `main`:

- Global theme: `src/styles.css`
- Hero styling: `src/ui/hero.css`
- Hero rendering: `src/ui/render-hero.ts`
- Hero content provider: `src/providers/demo/demo-hero-provider.ts`
- Product cards and detail image rendering: `src/ui/render-products.ts`
- COR recommendation cards: `src/ui/render-recommendations.ts`
- Saved choices: `src/ui/render-choices.ts`
- Compare view: `src/ui/render-compare.ts`
- Shared shell/navigation: `src/ui/render-application-shell.ts`

The existing NOOR Hero provider already supplies the approved Persian message, CTA route and Ray-Ban RB3025 media path. Therefore the Hero work should be a presentation adaptation around the current NOOR content contract, not a new hero data source.

The product renderer currently uses the `.product-card` and `.product-card-media` structure. Lab's React `ProductCard` cannot replace it. Adapt the current NOOR product image container and page styles while preserving its generated product facts, demo labels and actions.

## 6. Browser / deployment readiness evidence

For NOOR commit `99f9ae387eabccd6948ab135639108d7d0e89235`:

- Build Verification run [41886775656](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41886775656): build job succeeded. Behavioral tests, type-check/build, generated 15-product feed, and pinned COR mapping verification steps all completed successfully.
- Pages workflow run [41886775437](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/41886775437): build and artifact upload succeeded; deploy step itself succeeded; HTTPS demo catalog feed verification succeeded; live COR demo-session and recommendation API checks succeeded.
- The same Pages workflow's subsequent Chromium browser verification failed at `scripts/verify-browser-cor-shopper.mjs:321`, waiting 30 seconds for `.product-card` to become visible.
- Captured browser evidence in that run showed no browser console errors or failed requests; COR `/shopper/v1/demo-session` and `/shopper/v1/recommendations` both returned HTTP 200, and a `noor-test-...` request ID was observed.

Interpretation: the deployment and direct/live COR checks passed in this run; the end-to-end browser job did not pass because its product-card visibility assertion timed out. This is an independent browser-verification blocker. It must be diagnosed before claiming full browser readiness, but it is not evidence that COR recommendation connectivity failed. Do not change the selector or application code during this review; first establish whether the assertion is stale or whether the relevant UI state failed to render.

The run above proves the deploy action completed for that source SHA, but does not by itself prove which SHA is currently served by the public Pages URL. Verify the served release after the visual transfer and deployment.

## 7. Recommended sequential assembly order

1. **Baseline lock:** record the current NOOR main SHA and preserve the current working demo behavior.
2. **Theme foundation:** adapt only the Lab palette/type/surface decisions into NOOR's own CSS variables; keep COR semantic colors distinct.
3. **Hero:** adapt the existing NOOR Hero renderer and `hero.css` to the approved Lab composition. Preserve the provider, image source, CTA destinations and route handling.
4. **Product image/cards:** adapt NOOR-native product image/card CSS to the approved white image surface, larger usable image area and restrained card treatment. Keep `object-fit: contain`.
5. **Remaining presentation surfaces:** apply the same tokens and restrained spacing/border/hover rules to recommendations, saved choices, compare and profile/account pages without changing their behavior.
6. **Technical verification:** run the existing build and relevant behavioral tests; inspect the exact changed-file diff to prove no domain, catalog, store, API or COR files changed.
7. **Browser readiness:** resolve the `.product-card` assertion as a test/UI verification issue, run the real browser flow, and verify the actual served Pages SHA.
8. **Owner visual review:** only after technical checks are green, ask the owner to review desktop and mobile NOOR in the browser. Do not change the approved Lab design without feedback.

Each implementation stage should be a small, reviewable commit on a dedicated NOOR branch with a clear rollback point. Do not merge until the owner approves the final browser presentation.

## 8. Acceptance gates

- [ ] NOOR remains the application and the only presentation demo.
- [ ] Only approved Lab visual decisions are present; no Lab business logic/data/state is imported.
- [ ] NOOR route paths, product IDs, catalog/feed, COR request/response contracts, trace IDs, recommendation/no-match behavior and persistence are unchanged.
- [ ] Hero uses NOOR's existing content provider, media source and navigation contract.
- [ ] Product images remain uncropped and use the approved image treatment.
- [ ] Desktop and mobile layouts have no clipping or horizontal overflow.
- [ ] Existing build and behavioral tests pass.
- [ ] Browser smoke test passes with a valid assertion and real COR responses.
- [ ] Public Pages served SHA is identified and matches the approved release.
- [ ] Owner completes visual review before merge/release.

## 9. Review record

This review was performed read-only against the pins in section 2. The file/component mapping and scope exclusions above are the current handoff record. No application code, branch, deployment, Render service, Neon database, Clerk configuration, COR installation or Lovable project content was changed as part of this review.
