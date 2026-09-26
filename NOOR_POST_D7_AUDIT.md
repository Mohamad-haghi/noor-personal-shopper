# NOOR POST-D7 AUDIT

## Audit date
2026-09-26

## Baseline
GitHub main after D7-G CI Run #245.

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
- D7-G end-to-end and recovery tests: 9 test files / 27 tests passing in CI Run #245.

## Scope gaps found

### G1 — Branch selection is not executable yet
Routes /branches and /visit exist, and BranchProvider/VisitProvider boundaries exist, but DemoBranchProvider returns an empty list and DemoVisitProvider only echoes a request without executable branch discovery/selection flow.
Impact: the locked in-person visit path is not complete as a user-facing journey.
Classification: implementation-level gap if completed using the existing BranchProvider/VisitProvider boundaries. No architecture redesign is indicated by the audit.

### G2 — In-person visit scheduling UI is not executable yet
The Visit domain supports branch, account, scheduledAt, duration, purpose and status, but the current application shell does not render a /visit workflow.
Impact: the approved path 'انتخاب شعبه → زمان مراجعه → ثبت درخواست → Request ID → Confirmation' is incomplete.
Classification: implementation-level gap using existing VisitService/VisitProvider/Confirmation boundaries.

### G3 — Real inventory smart-link is not yet surfaced as a user-facing flow
Product records already carry external identifiers including NOOR reference values, but the current UI does not expose a destination-aware 'smart link to real NOOR inventory' from a product/choice/confirmation journey.
Impact: future inventory connectivity is architecturally prepared, but the demo does not yet demonstrate the smart-link behavior required by the locked scope.
Classification: implementation-level gap unless a new external integration boundary is proposed. Do not add a real external integration now.

### G4 — Selection Profile persistence is incomplete
The domain and provider/service boundaries exist, but the current shopper UI displays the selected answers as a session summary and does not persist a structured SelectionProfile through ShopperProfile/SelectionProfile services.
Impact: the scope item 'user selection profile' is only partially represented.
Classification: implementation-level gap if the existing profile boundaries are sufficient; inspect exact contracts before implementation.

### G5 — Product/detail route coverage needs implementation review
/products and /products/:id are declared routes, but the application shell currently falls through to the generic route placeholder for them.
Impact: the demo has no executable catalog/detail inspection path beyond recommendation cards.
Classification: implementation-level UI gap; existing CatalogService can be used. No architecture redesign indicated.

## Not identified as gaps
- No real NOOR API/CMS/auth/payment integration is required at this demo stage.
- No AI/LLM integration is required.
- No LocalStorage/database is required by the locked demo architecture.
- No Product price field is required; CommerceOffer remains the approved pricing boundary.
- No architecture redesign is required by the current findings.

## Recommended next execution order
1. Complete G1 + G2: executable branch selection and in-person visit request flow.
2. Complete G4: persist the structured SelectionProfile through the existing boundaries.
3. Complete G3: surface destination-aware smart-link behavior without connecting to real NOOR inventory.
4. Complete G5: product listing/detail inspection using the existing CatalogService.
5. Run a final runtime/browser QA pass across the complete demo journey.

## Architecture gate
No architecture change is approved or proposed by this audit. If implementation of any item requires a new provider/service boundary or changes the existing composition architecture, STOP and report before changing it.