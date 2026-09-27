# NOOR Personal Shopper — FINAL POLISH & GAP CLOSURE CHECKPOINT

STATUS: FINAL GAP CLOSURE / RUNTIME QA
SOURCE OF TRUTH: GitHub main
DATE: 2026-09-27

## Purpose
This checkpoint preserves the exact remaining polish/runtime gaps discovered during manual browser QA after the D1–D7/G1–G5 implementation and verification. Future chats must continue from this list and must NOT restart the project.

## Locked rule
No feature expansion. Fix only verified scope gaps, runtime defects, media/content gaps, UX inconsistencies, routing/deployment defects, and visual polish required for the approved Demo.

## Verified browser PASS areas
- Home / Shopper entry
- Shopper questionnaire
- Recommendation generation
- My Choices
- Compare
- Product Detail basic display
- Product Detail → Add to Cart
- Cart
- Checkout account guard
- Delivery checkout
- Payment success
- Payment failure → retry → success
- Order creation
- Confirmation / Request ID
- Branches
- Visit scheduling
- Visit request / Request ID
- Search
- Search → Product Detail
- Mobile navigation / scrolling
- Cart → Checkout guard

## Real remaining gaps

### P1 — Product media
- Recommendation cards have no product images.
- Product Detail has no product image.
- Catalog seed currently uses null/empty product media.
- Product media must remain structured under Product.media.
- Current phase: prepare/upload exact NOOR product images first.
- Do NOT work on Hero video in this phase.
- Do NOT substitute visually similar products when exact NOOR product matching is unavailable.
- Prepared GitHub folder root: public/media/products/
- 15 product folders have been created.
- User will upload the exact product image into each folder as primary.jpg.
- After uploads: connect Product.media.primaryImage to these assets, then build + CI + browser verify.

### P2 — Recommendation reasons
- Reasons need greater diversity and product-specific specificity.
- Preserve deterministic/non-AI recommendation architecture.

### P3 — Compare → Product Detail
- Direct Product Detail navigation from Compare is missing.

### P4 — Pickup branch selector
- Current UI uses manual Branch ID input.
- Required UX: branch selector such as «انتخاب شعبه [▼]», showing branch name/location while retaining internal branch ID.

### P5 — Delivery vs Pickup form differentiation
- Delivery should emphasize recipient/contact + address.
- Pickup should emphasize selected branch + pickup information.
- Forms should not look like the same generic form.

### P6 — Product Detail CTAs
Missing:
- Product Detail → Personal Shopper CTA.
- Product Detail → NOOR Store CTA.
The NOOR Store CTA must use the existing destination-aware smart-link architecture.

### P7 — GitHub Pages deep-link / refresh routing
Confirmed real issue:
- Internal Product Detail navigation works.
- Refreshing a Product Detail deep URL returns GitHub Pages 404.
- Search deep-link refresh also returns 404.
- Do not re-test Search refresh unnecessarily; it is already confirmed.
- Unknown-product route testing is blocked by the same deployment routing problem and must be evaluated only after deep-link fallback is fixed.

### P8 — Independent Shopper Account persistence
- Register/login/logout works in the current session.
- Account is lost after full site exit/new session.
- Approved identity direction: phone-first.
- Shopper account remains independent from NOOR website authentication.
- Do not replace with dependency on NOOR production auth.

### P9 — NOOR smart link specificity
- Recommendations/My Choices CTA exists and leaves Demo for NOOR.
- Current destination reaches general NOOR/search destination rather than a specific product result.
- Improve destination specificity using the existing external reference / smart-link architecture where exact mapping is available.
- No invented product URLs.

### P10 — Similar Frames UI
- SearchService.findSimilar architecture/tests exist.
- Similar Frames UI is not visibly rendered in the observed Product Detail/Search experience.
- Verify actual render path and expose the existing capability where the approved scope requires it.
- Do not create a parallel recommendation/search architecture.

### P11 — Unknown product handling
- Direct unknown-product test currently produced an error/404.
- Treat as a separate app-level issue only after GitHub Pages deep-link fallback is fixed.
- Then verify graceful in-app unknown-product state.

## Product image source rule
Primary source: official NOOR Optic website:
https://www.nooroptic.com/fa/

Only exact model/reference matches are acceptable. Do not use similar models as substitutes.

## Current implementation order
1. Product image uploads.
2. Wire Product.media.primaryImage.
3. Build + CI.
4. Browser verify product images.
5. Close remaining functional/UX gaps P2–P11.
6. Fix GitHub Pages deep-link routing before evaluating unknown-product fallback.
7. Final visual/runtime regression QA.
8. Final checkpoint.

## Verification rule
Nothing is considered VERIFIED from builder claims alone. Acceptance requires repository inspection and, where applicable, green GitHub Actions plus actual browser/runtime verification.

## Current GitHub source-of-truth rule
GitHub main is canonical. Future chats must read this checkpoint and NOOR_PROJECT_STATE.md before continuing implementation.
