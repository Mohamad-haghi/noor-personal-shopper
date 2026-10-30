# NOOR UI Comparison and Product Handoff Browser Proof

**Purpose:** Close COR + NOOR Product Proof Release Gate 2 with evidence from the customer-facing UI, correlated to live COR API responses.

## Fixed target pins

- Deployed NOOR Pages source: `d58ba221122b9124460cd17c267ead53abaaac2c` (Pages run #277)
- COR package pin used by NOOR Pages: `d306c5efee32707362ac2ee449ef85f95cd876a5`
- COR Render runtime: `d5737543918c92401ebf5dbff1f0e5c0ef50dc70`
- COR staging installation: `70826f81-a11d-455b-9c33-de7e02303512`

## Why this test exists

Pages run #277 already proves the comparison and handoff HTTP API contracts, and Chromium/WebKit already prove the recommendation journey and displayed score/order. The remaining gap is UI interaction evidence for the comparison screen and product-detail handoff. Do not repeat the already accepted recommendation/API smoke tests.

## Browser scenario

The Playwright script `scripts/verify-live-ui-comparison-handoff.mjs`:

1. Opens the deployed NOOR Pages application.
2. Completes the current counselor journey.
3. Adds two recommendation cards to comparison through their actual UI buttons.
4. Opens the comparison page and verifies the rendered comparison table.
5. Correlates the UI action with a successful COR `/shopper/v1/comparisons` response, matching request ID and product IDs.
6. Selects a product through the comparison page's actual demo-cart action.
7. Verifies the demo cart notice and approved NOOR store link.
8. Correlates the UI action with a successful COR `/shopper/v1/handoffs` response.

The workflow uploads `noor-live-ui-comparison-handoff` JSON evidence. It must not record bearer credentials, authorization headers, or secrets.

## Safety boundary

This is a read-only product-proof exercise against the deployed demo. It may create ephemeral in-memory comparison/cart state in the browser, but must not create a real order or payment. No app runtime, catalog data, Render service, Neon database, Clerk configuration, or COR installation may be modified. Keep the verification PR unmerged; it must not trigger a Pages deployment.

## Acceptance

Gate 2 closes only after a successful browser run proves both UI flows, matching live COR API responses, and the evidence artifact has been inspected and linked in COR Issue #266. Any failure remains an open blocker; do not weaken assertions to manufacture a pass.
