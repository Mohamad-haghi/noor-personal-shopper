# COR Recommendation Trace — NOOR Engineering Test

## Purpose

Use this test path to collect evidence about COR's current recommendation logic without changing customer-facing behavior. COR remains the only recommendation engine.

## Manual trace marker

For a browser-driven trace test, use this URL:

`https://mohamad-haghi.github.io/noor-personal-shopper/?corTrace=1`

The marker must survive in-app navigation and produce a request ID beginning `noor-test-`. A normal URL without the query marker is not expected to request criterion-level tracing.

## Required staging configuration

The approved staging Render service must have `COR_SHOPPER_RECOMMENDATION_TRACE_ENABLED=true`. The URL marker only labels a controlled request; it does not enable server-side tracing. Keep this flag limited to the approved staging service. Never enable it on production or alter the protected legacy installation.

## Automated live browser verification

The GitHub Pages deployment workflow runs controlled COR cases and then drives the actual NOOR UI in both Chromium and WebKit. For each real UI request it:

- captures the actual `noor-test-*` request ID;
- captures the response's product IDs and normalized scores;
- captures the rendered NOOR card product IDs, names, and displayed percentages;
- fails if the visible product order, card count, or displayed whole percentages differ from the COR response.

This closes the UI-to-COR comparison gap. A successful HTTP response or a green browser flow without these comparisons is not sufficient evidence of ranking correctness.

## Evidence storage

Every accepted live browser run must have one durable evidence record in the NOOR repository under `docs/evidence/`. The record must contain:

- exact request ID and matching Render `testRunId`;
- full `cor.shopper.recommendation_test_trace` event;
- runtime commit and installation/configuration/mapping/Domain Pack/decision-model pins;
- normalized intent actually received by COR;
- every candidate and every criterion's requested/actual value, match, hardness, weight, and score contribution;
- score numerator, denominator, recomputed score, and recomputation result;
- Chromium/WebKit browser output, including visible card IDs/names/percentages and the paired COR response;
- explicit pass/fail checks for truncation, score recomputation, candidate order, and displayed percentage equality.

The first complete paired browser evidence record is:

`docs/evidence/2026-10-30-live-noor-cor-browser-traces.json`

It contains 13 direct live COR scenario traces plus separate Chromium and WebKit UI runs, each with its own request ID and complete COR trace event. Render logs remain the live operational source; the checked-in evidence JSON preserves the exact reviewed records for future audits.

## Evidence and limitations

- COR staging logs are authoritative for the actual criterion-level decision trace and pinned runtime configuration.
- A successful recommendation response does not by itself prove score correctness.
- Do not log credentials, raw authorization headers, shopper names, email addresses, phone numbers, or account identifiers.
- Any missing trace, mismatched request ID, truncated intent/candidate/criterion list, missing version pin, failed score recomputation, or mismatch between COR response and visible NOOR cards makes the run incomplete or failed.
- The UI percentage is a normalized match score, not a calibrated probability of suitability.
- A trace proves what the deployed engine received and calculated; it does not prove the product facts themselves are accurate or that the weights are commercially optimal. Those require separate source-backed catalog verification and ranking-quality review.
