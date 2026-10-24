# COR Connection Incident and Verification Runbook

**Incident date:** 2026-10-22 to 2026-10-24  
**Status:** Core NOOR → COR demo recommendation path working; full journey not yet verified  
**Scope:** Public NOOR GitHub Pages demo and the COR demo Shopper API on Render

## Executive summary

The NOOR demo previously displayed:

`cor_demo_credential_session_and_health_fetch_failed`

The browser could not complete the demo credential/session request and its fallback liveness probe. Earlier checks showed HTTP success for some COR endpoints, but those checks alone did not prove that the browser could complete the full authenticated recommendation request.

The NOOR browser fetch implementations were changed to bind the default platform fetch function to `globalThis`. The deployment workflow for commit `a52d9cffe98bc262b639bcde7b04fb3c3999b568` completed successfully (GitHub Actions run [40066154430](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/40066154430)). After this update, the live demo displayed three product recommendations. The repository README also records a successful live COR recommendation smoke test.

**Conclusion:** The core demo session/recommendation path is working in the observed deployment. The exact root cause of the earlier browser failure has not been conclusively proven from browser/network logs. Comparison and handoff must not be described as verified until separately tested end-to-end.

## User-visible symptom

The NOOR page showed a Persian unavailable message saying that no valid recommendation had been received from the decision service and included:

`cor_demo_credential_session_and_health_fetch_failed`

This code represented failure to complete both the demo-session request and the public health/liveness probe from the browser. It did not, by itself, prove that the whole COR service was down.

## Timeline and changes

1. **Initial symptom:** NOOR could not obtain its short-lived demo credential through the browser path. Some endpoint checks returned HTTP success, which was insufficient to prove a working browser-to-COR recommendation flow.
2. **Diagnostics:** Browser fetch failures were split by stage (`demo-session` and `health-live`) with safe logging of stage, outcome, and HTTP status only. Do not log credentials, authorization headers, response bodies, or exception details.
3. **Credential-provider hardening:** The default fetch implementation in `src/integration/cor-shopper-demo-credential-provider.ts` was changed to `globalThis.fetch.bind(globalThis)`.
4. **Remote-client hardening:** The default fetch implementation in `src/integration/cor-shopper-remote-client.ts` received the same binding treatment.
5. **CI/deployment:** Commit `a52d9cffe98bc262b639bcde7b04fb3c3999b568` passed the NOOR Pages workflow in run [40066154430](https://github.com/Mohamad-haghi/noor-personal-shopper/actions/runs/40066154430).
6. **Observed live behavior:** The published demo subsequently displayed three COR-based product recommendations. This is evidence that the core recommendation path works; it is not proof that comparison, handoff, production security, or real retailer systems work.

The fetch-binding change is a plausible and useful browser-compatibility fix, but the available evidence does not establish it as the sole root cause. Preserve that distinction in future incident reports.

## Current architecture and safety boundaries

- NOOR is the public demo UI hosted on GitHub Pages.
- COR Shopper API is hosted separately at `https://cor-noor-test.onrender.com`.
- NOOR requests a short-lived, demo-only bearer credential at `GET /shopper/v1/demo-session`; it must not embed a static API key or reusable secret in the browser bundle.
- The configured COR base URL must be an HTTPS origin without a path, query, fragment, username, or password (except local HTTP for localhost development).
- The demo catalog and product availability are demo/reference data. The integration does not connect real NOOR inventory, customer accounts, cart, checkout, payment, or order systems.
- A successful CI run proves the tested build/checks passed; it does not replace a live browser smoke test.

## Runbook for a new installation

1. **Check configuration**
   - Set `VITE_NOOR_MODE=integrated`.
   - Set `VITE_COR_SHOPPER_BASE_URL` to the COR HTTPS origin only.
   - Confirm COR server-side demo-session settings, tenant/installation identifiers, audience/issuer, HMAC key ID and signing key, approved origin, catalog feed and allowed origin.
   - Keep all secrets server-side. Never use `VITE_*` for secrets.
2. **Check service health**
   - Verify COR's configured readiness endpoint (`/health/ready`) and liveness endpoint (`/health/live`).
   - Health success proves service reachability only; continue to the browser test.
3. **Test from the published NOOR origin**
   - Open the actual deployed site in the target browser.
   - Run a fresh shopper consultation and verify that product recommendations load from COR.
   - If it fails, capture the exact diagnostic code and the safe `[noor.cor.browser_fetch]` console fields: `stage`, `outcome`, and optional `status`.
   - In DevTools Network, check the demo-session request, response status, final URL/origin, CORS behavior, and subsequent Shopper API request. Never copy bearer tokens or secret headers into an issue.
4. **Test operations independently**
   - Run and record recommendation, comparison, and handoff separately.
   - Confirm a failed remote decision is surfaced as unavailable and is not silently replaced by local recommendations.
   - Verify that handoff destinations are server-resolved and safe.
5. **Record evidence**
   - Record commit SHA, workflow run, deployment time, browser/device, tested operation, outcome, and sanitized error code.
   - Label each check as CI, direct endpoint, or real browser end-to-end. Do not treat these as interchangeable.

## Diagnostic guide

| Symptom | Meaning to investigate | Next check |
| --- | --- | --- |
| `cor_demo_credential_session_and_health_fetch_failed` | Browser fetch for demo session and liveness probe both failed | Browser console/network, origin, CORS, service wake-up and fetch receiver |
| `cor_demo_credential_http_error` | Session endpoint returned a non-success HTTP status | Check HTTP status and sanitized COR server logs |
| `cor_demo_credential_cors_blocked` | COR was reachable via the probe but the credential response was not readable as a normal CORS response | Check exact approved origin and CORS response headers |
| `cor_demo_credential_configuration_invalid` | Base URL is not an accepted origin | Remove path/query/fragment/credentials; use HTTPS |
| `cor_service_unavailable` | The Shopper API request could not complete successfully | Check API status, installation readiness, provider health and sanitized server logs |

Use the actual code emitted by the current build; this table is a guide, not a substitute for inspecting the error mapping.

## Verification matrix

| Area | Current status | Evidence / follow-up |
| --- | --- | --- |
| NOOR build and deployment workflow | **Passed** | GitHub Actions run 40066154430 |
| Live demo session + recommendation path | **Observed working** | Published page displayed three recommendations; repository README records live recommendation smoke test |
| Root cause of original browser failure | **Not conclusively proven** | Need contemporaneous browser/network diagnostics to attribute cause with confidence |
| Comparison from live browser | **Not yet verified** | Run independent end-to-end test |
| Handoff destination from live browser | **Not yet verified** | Run independent end-to-end test and inspect destination safety |
| Real NOOR catalog/inventory/checkout | **Not connected** | Out of scope for this demo |

## References

- [NOOR live demo](https://mohamad-haghi.github.io/noor-personal-shopper/)
- [COR operator console](https://cor-noor-test.onrender.com/operator-console)
- [NOOR integration guide](./COR_SHOPPER_DEMO_INTEGRATION_V1.md)
- [NOOR repository README](../README.md)
