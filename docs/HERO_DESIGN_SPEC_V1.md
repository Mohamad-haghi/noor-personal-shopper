# NOOR Home Hero — Design Specification V1

**Status:** Design direction approved for Lovable implementation  
**Date:** 2026-11-03  
**Owner:** Product/design direction by ChatGPT; visual execution by Lovable  
**Target:** NOOR home page only — no COR, catalog, shopper-flow or commerce changes.

## 1. Design objective

Create a premium, calm, editorial first impression that makes the product's value understandable within a few seconds: NOOR helps people make a more considered eyewear choice through a guided consultation and transparent recommendations.

The Hero should feel like a refined eyewear studio, not a generic AI landing page, discount store or marketplace.

## 2. Core message

**Primary Persian headline:**

> عینکی که با شناخت شما انتخاب می‌شود.

**Supporting copy:**

> سلیقه و نیازتان را در یک گفت‌وگوی کوتاه بیان کنید؛ NOOR گزینه‌ها را با معیارهای روشن بررسی می‌کند و دلیل هر پیشنهاد را نشان می‌دهد.

**Primary CTA:** `شروع مشاوره انتخاب عینک` → existing `/shopper` route.

**Secondary CTA:** `مشاهده مجموعه` → existing `/catalog` route.

**Eyebrow:** `THE INTELLIGENT EYEWEAR STUDIO` (English, LTR).

**Trust/disclosure line:** `نمونهٔ نمایشی مستقل · بدون فروش واقعی`

Do not add unsupported marketing claims such as guaranteed fit, facial recognition, virtual try-on, live inventory, real prices, delivery, or real checkout.

## 3. Composition and hierarchy

### Desktop (≥768px)
- Center content in the existing `max-w-6xl` page container.
- Two-column editorial composition with balanced visual weight.
- In RTL reading order, copy and CTAs sit on the right; product visual sits on the left.
- Copy column: eyebrow, headline, supporting paragraph, CTA pair, discreet demo disclosure.
- Visual column: one large, clean product image on a warm ivory/sand stage, with a restrained border and soft tonal contrast.
- Product visual should occupy approximately 45–50% of the Hero width. Avoid oversized decorative effects.
- Keep the hero vertically centered and generously spaced; avoid pushing the first supporting section too far below the fold.

### Mobile (<768px)
- Single column, RTL.
- Copy appears before the image so the value proposition and primary action are immediately visible.
- Headline should wrap naturally in 2–3 lines without clipping.
- Buttons stack or wrap cleanly; primary CTA must be full-width or visually dominant and easy to tap.
- Product image follows the CTAs and remains large enough to identify the frame.
- Avoid horizontal overflow, tiny text, floating elements that obscure the image, and layout shifts.

## 4. Product visual

Use the existing real demo catalog asset already referenced by the project:
- Product ID: `ray-ban-rb3025-181-71`
- Display name: `Ray-Ban RB3025 181/71`
- Existing image path from catalog helper: `https://mohamad-haghi.github.io/noor-personal-shopper/media/products/ray-ban-rb3025-181-71/primary.jpeg`
- Verified catalog labels in the Lovable prototype: sunglasses / aviator / metal / gold.

Image treatment:
- Preserve the source image and product appearance; do not generate a substitute, recolor it, or invent a lifestyle photograph.
- Use `object-contain`, a warm neutral background, and enough breathing room around the frame.
- Do not crop important parts of the frame.
- Add a small, quiet caption below the image: `Ray-Ban RB3025 181/71` and `خلبانی · فلز · طلایی`.
- The image is demo catalog content; do not imply NOOR owns or sells this product.

## 5. Visual language

- Retain the existing NOOR identity: warm ivory background, restrained bronze accent, muted neutral text, Vazirmatn for Persian UI, editorial serif treatment for small English labels where already available.
- Use subtle contrast and generous whitespace rather than gradients, neon colors, heavy shadows or glassmorphism.
- Corners should remain modest and consistent with existing cards.
- Animation, if any, must be subtle and respect reduced-motion preferences. No autoplay video or carousel.
- Keep the existing header/navigation and downstream page sections intact.

## 6. Interaction and accessibility

- Primary CTA navigates to the existing `/shopper` route.
- Secondary CTA navigates to the existing `/catalog` route.
- Both must be semantic links with visible focus states.
- Product image must have descriptive alt text.
- Maintain RTL direction for Persian content and LTR direction for English brand/model labels.
- Ensure sufficient text contrast and comfortable touch targets (minimum 44px).
- No new interactions, forms, tracking or data collection.

## 7. Scope restrictions

Lovable must edit only the home-page Hero presentation and directly necessary Hero-specific styling. It must not:
- change route definitions or navigation behavior;
- modify catalog content, IDs, product facts, image URLs or data shape;
- change the shopper, profile, recommendation, save, compare, product detail, checkout/handoff or manager flows;
- alter COR integration, API requests, scoring, trace display, no-match behavior or credentials;
- install packages or add a database, backend, authentication, payment or commerce service;
- publish the project or connect it to GitHub/production without separate approval.

If a requested detail cannot be implemented within this scope, report the blocker instead of expanding scope.

## 8. Acceptance checklist

- [ ] Hero headline and supporting copy match this specification.
- [ ] Primary and secondary CTAs navigate to the existing routes.
- [ ] Existing Ray-Ban RB3025 demo catalog image is used unchanged.
- [ ] Desktop layout is balanced, RTL-correct and visually premium.
- [ ] Mobile layout puts message/CTAs before image and has no horizontal overflow.
- [ ] Product caption is accurate and demo disclosure remains visible.
- [ ] Existing header and below-the-fold sections are unchanged.
- [ ] No catalog, COR, shopper-flow, commerce or backend behavior changed.
- [ ] Lovable preview is inspected at mobile and desktop widths.
- [ ] Agent reports exact changed files, commit SHA, build status and any remaining issues.

## 9. Handoff to GitHub

Lovable is the visual prototyping executor, not the source of truth. After acceptance:
1. Capture the approved preview and exact changed-file list.
2. Reconcile the Hero change against the current GitHub `main` implementation.
3. Port only approved presentation changes into a new GitHub branch.
4. Run the existing test/build workflow and inspect the resulting Pages deployment.
5. Update release evidence with source SHA and workflow/deployment run.
6. Do not merge or publish until the owner approves the final preview and evidence.
