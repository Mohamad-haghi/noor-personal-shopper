# NOOR → COR Shopper Demo Integration V1

Status: integrated demo deployed; live recommendation/session path observed working. Comparison and handoff still require separate end-to-end verification.

## Current verification status

- The NOOR Pages deployment workflow for commit `a52d9cffe98bc262b639bcde7b04fb3c3999b568` passed (run [40066154430](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/40066154430)).
- The published NOOR demo subsequently displayed three product recommendations, and the repository README records a successful live COR recommendation smoke test.
- The earlier browser error `cor_demo_credential_session_and_health_fetch_failed` is documented in [the connection incident and runbook](./COR_CONNECTION_INCIDENT_AND_RUNBOOK.md). The exact root cause has not been conclusively proven from contemporaneous browser/network logs.
- Do not claim comparison or handoff are verified until each has passed a published-site browser end-to-end test. CI success is not runtime proof.

## What integrated mode does

When the public build variable `VITE_NOOR_MODE=integrated` is selected and `VITE_COR_SHOPPER_BASE_URL` is set to the COR service origin, the NOOR recommendation, comparison, and handoff bridges use the remote COR Shopper API. A failed remote call is surfaced as an unavailable operation; it does not silently fall back to the local decision engine.

The demo catalog and non-decision site features remain demo-only. This does not connect real NOOR inventory, prices, accounts, cart, checkout, payment, or orders. Responses from the current COR runtime explicitly carry `demoOnly: true`.

## Browser build configuration

Set only these public Vite variables in the site build environment:

- `VITE_NOOR_MODE=integrated`
- `VITE_COR_SHOPPER_BASE_URL=https://<your-hosted-cor-origin>`

The value must be an HTTPS origin with no path, query, fragment, username, or password. Local HTTP is allowed only for localhost development.

**Never put `COR_SHOPPER_HMAC_SIGNING_KEY`, database credentials, or any reusable secret in a Vite variable or browser bundle.** The browser obtains a five-minute, installation-scoped demo bearer from `GET /shopper/v1/demo-session` with `cache: no-store`.

## COR server prerequisites

The hosted COR runtime must be configured server-side with the complete required set:

- `COR_SHOPPER_ISSUER`
- `COR_SHOPPER_DEMO_TENANT_ID`
- `COR_SHOPPER_DEMO_INSTALLATION_ID`
- `COR_SHOPPER_AUDIENCE`
- `COR_SHOPPER_HMAC_KEY_ID`
- `COR_SHOPPER_HMAC_SIGNING_KEY` (at least 32 UTF-8 bytes; secret)
- `COR_SHOPPER_CATALOG_FEED_URL`
- `COR_SHOPPER_CATALOG_ALLOWED_ORIGIN`
- `COR_SHOPPER_APPROVED_ORIGINS` (must include the exact site origin, e.g. `https://mohamad-haghi.github.io`)

A real PostgreSQL database, the trusted installation, its pinned Mapping and Domain Pack, revocation storage, migrations, and rate-limit schema must also be ready. Do not invent tenant/installation IDs or mark the integration live until the operator has created and validated them.

The public demo-session endpoint is not user authentication. Exact Origin checks are browser policy, not identity proof. It is only suitable for a read-only, explicitly demo-only, single-installation experience; never reuse it for a production customer.

## Current contract limitation

The COR runtime currently rejects variant-specific handoff requests. The NOOR remote bridge therefore requests only the server-resolved product-level destination and never submits a browser-provided destination URL. Do not claim a selected variant is preserved by the handoff until the COR contract and runtime support it.

## Verification required before manager demo

1. NOOR PR CI passes and the change is merged.
2. Main CI passes for the merge commit.
3. Configure the COR service and database using free-tier resources only if their current limits support the test; do not enter payment details for a test.
4. Verify `GET /shopper/v1/demo-session` from the exact published site origin.
5. Verify successful recommendation, comparison, and handoff requests from the published site.
6. Verify missing/expired credentials, disallowed Origin, disabled installation, timeout, malformed response, and COR outage fail closed.
7. Verify the UI still clearly labels the catalog, availability, and prices as demo-only.
8. Record runtime evidence separately from CI evidence.
