# COR Recommendation Trace — NOOR Engineering Test

## Purpose

Use this test path to collect evidence about COR's current recommendation logic without changing customer-facing behavior. COR remains the only recommendation engine.

## Manual trace marker

For a browser-driven trace test, use the following URL:

`https://mohamad-haghi.github.io/noor-personal-shopper/?corTrace=1`

The marker should survive in-app navigation and result in a request ID beginning `noor-test-`. A normal URL without the query marker is not expected to request criterion-level tracing.

## Automated live smoke test

The GitHub Pages deployment workflow includes a dedicated trace-marked recommendation request with request ID `noor-test-pages-live-smoke`. This makes the deployment's controlled test identifiable in COR staging logs without asking the operator to manually change the URL. The test is a technical smoke test, not a user-personalization test.

## Evidence and limitations

- GitHub Actions workflow run records the HTTP/browser checks and returned public recommendation summary.
- COR staging server logs are the authoritative source for criterion-level requested/actual values, match status, weights, contributions, and pinned configuration versions.
- A successful recommendation response does not by itself prove score correctness.
- Keep trace limited to controlled test requests. Never log credentials, raw authorization headers, shopper names, email addresses, or account identifiers.
- The trace flag must be enabled only on the intended staging service; do not modify the protected legacy installation or production configuration.
