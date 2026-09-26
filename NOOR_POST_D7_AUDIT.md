# NOOR POST-D7 AUDIT

## Audit date
2026-09-26

## Baseline
GitHub main after G3 CI Run #260.

## Verified complete
- Personal Shopper journey: Intro → type → use case → style → face shape → recommendations.
- Recommendation Engine: deterministic 3-result recommendations with explanation.
- Choices / Favorites-style saved choices and comparison.
- Independent Shopper Account/Auth.
- Demo Commerce pricing separated from Product.
- Cart with price snapshots.
- Checkout with delivery/pickup data and order pricing.
- Mock Payment success/failure/retry.
- Confirmed Order persistence in demo runtime.
- Confirmation with Order ID and Request ID.
- D7-G end-to-end and recovery tests.
- G1 — executable Branch selection and pickup validation.
- G2 — executable in-person visit scheduling/request flow.
- G3 — destination-aware NOOR inventory smart link.

## G1 — VERIFIED
Implemented through the existing BranchProvider/BranchService boundaries:
- 3 Demo branches.
- Branch listing and lookup.
- Branch selection UI.
- Pickup capability validation.
- Existing checkout pickup path validates the selected branch.

CI Run #256:
- 10/10 test files PASS.
- 30/30 tests PASS.
- Type-check PASS.
- Production build PASS.

No architecture change.

## G2 — VERIFIED
Implemented through the existing VisitProvider/VisitService/Confirmation boundaries:
- Branch selection.
- Demo time-slot selection.
- Visit purpose selection.
- Visit request persistence in Demo runtime.
- Request ID.
- Confirmation state.
- Independent Shopper account requirement.

CI Run #256:
- 10/10 test files PASS.
- 30/30 tests PASS.
- Type-check PASS.
- Production build PASS.

No architecture change.

## G3 — VERIFIED
Implemented without adding a new provider/service boundary:
- Added destination-aware NOOR inventory link resolution.
- Resolution uses structured Product external identifiers:
  `providerProductId → externalSystemIds.noorReference → sku`.
- No demo product IDs are hard-coded into link generation.
- Recommendations expose the smart link.
- My Choices exposes the smart link.
- The UI identifies the NOOR reference used for the destination.
- The Demo explicitly remains disconnected from live NOOR inventory.
- No real API/CMS/inventory integration was added.

The current NOOR storefront was verified at `https://www.nooroptic.com/fa/`; product pages expose model/reference information, which supports the destination-aware search-link behavior used by the Demo. citeturn2view0turn3view0

CI Run #260 / Run ID 36270301855:
- 11/11 test files PASS.
- 33/33 tests PASS.
- Type-check PASS.
- Production build PASS.
- Warning only: GitHub Actions Node.js 20 deprecation notice.

Checkpoint:
`NOOR_G3_CHECKPOINT.md`

## Remaining scope gaps

### G4 — Selection Profile persistence
VERIFIED.

The SelectionProfile architecture was intentionally upgraded rather than bypassed:
- SelectionProfile now carries structured questionnaire criteria.
- Optional AccountId ownership allows anonymous demo usage and future account association.
- Dedicated SelectionProfileProvider / SelectionProfileService boundaries were added.
- DemoSelectionProfileProvider persists the profile in demo runtime state.
- ShopperFeature now persists questionnaire changes through SelectionProfileService.
- Direct LocalStorage persistence was removed from the ShopperFeature.

CI Run #276:
- 13/13 test files PASS.
- 37/37 tests PASS.
- Type-check PASS.
- Production build PASS.

Checkpoint: `NOOR_G4_CHECKPOINT.md`

This is an approved architecture extension: it preserves the existing Provider → Service → Feature layering while adding the missing persistence seam required by the scope.

### G5 — Product/detail route coverage
`/products` and `/products/:id` are declared routes, but the application shell currently falls through to the generic route placeholder.

Classification: implementation-level UI gap using the existing CatalogService. No architecture redesign is currently indicated.

## Not identified as gaps
- No real NOOR API/CMS/auth/payment/booking integration is required at this demo stage.
- No AI/LLM integration is required.
- No Product price field is required; CommerceOffer remains the approved pricing boundary.
- No new persistence architecture is required by the current audit.
- No architecture redesign is approved or required.

## Recommended next execution order
1. G4 — persist the structured SelectionProfile through the existing boundaries.
2. G5 — implement executable `/products` and `/products/:id` inspection using CatalogService.
3. Final runtime/browser QA across the complete demo journey.

## Architecture policy
Architecture may be extended when the change directly improves:
- demo completeness and independence,
- separation of domain concerns,
- future NOOR API/CMS/account/commerce integration readiness,
- scalability to the real NOOR catalog and users,
- testability and failure isolation.

Architecture must not be replaced or changed gratuitously. Any material architecture extension must be documented in the relevant checkpoint and verified by CI before acceptance.
