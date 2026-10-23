import { chromium } from "playwright";

const pagesUrl = process.env.PAGES_URL;
const corBaseUrl = process.env.COR_SHOPPER_BASE_URL;
if (!pagesUrl || !corBaseUrl) {
  throw new Error("browser_smoke_configuration_missing");
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(pagesUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });

  const result = await page.evaluate(async ({ corBaseUrl }) => {
    const origin = window.location.origin;
    const fetchJson = async (stage, url, init = {}) => {
      let response;
      try {
        response = await fetch(url, {
          cache: "no-store",
          credentials: "omit",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          ...init,
        });
      } catch (error) {
        return {
          ok: false,
          stage,
          outcome: "fetch_rejected",
          errorName: error instanceof Error ? error.name : "unknown",
        };
      }
      let body;
      try {
        body = await response.json();
      } catch {
        return { ok: false, stage, outcome: "invalid_json", status: response.status };
      }
      if (!response.ok) {
        return { ok: false, stage, outcome: "http_error", status: response.status, error: body?.error ?? null };
      }
      return { ok: true, stage, status: response.status, body };
    };

    const health = await fetchJson("health-live", new URL("/health/live", corBaseUrl));
    if (!health.ok) return health;
    if (health.body?.status !== "alive") {
      return { ok: false, stage: "health-live", outcome: "unexpected_contract", status: health.status };
    }

    const session = await fetchJson("demo-session", new URL("/shopper/v1/demo-session", corBaseUrl));
    if (!session.ok) return session;
    const credential = session.body?.credential;
    if (session.body?.contractVersion !== "1.0.0" ||
        session.body?.credentialType !== "short_lived_demo_bearer" ||
        session.body?.demoOnly !== true ||
        typeof credential !== "string" || credential.length < 24) {
      return { ok: false, stage: "demo-session", outcome: "unexpected_contract", status: session.status };
    }

    const recommendation = await fetchJson(
      "recommendations",
      new URL("/shopper/v1/recommendations", corBaseUrl),
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + credential,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractVersion: "1.0.0",
          requestId: "noor-real-browser-smoke",
          sessionId: "noor-real-browser-smoke",
          intent: {
            category: "sunglasses",
            preferences: { shape: "aviator" },
            constraints: {},
            priorities: [],
            desiredAttributes: [],
            excludedAttributes: [],
          },
          limit: 3,
        }),
      },
    );
    if (!recommendation.ok) return recommendation;
    if (recommendation.body?.contractVersion !== "1.0.0" ||
        recommendation.body?.requestId !== "noor-real-browser-smoke" ||
        recommendation.body?.result?.source !== "cor_canonical_engine" ||
        recommendation.body?.result?.demoOnly !== true ||
        !Array.isArray(recommendation.body?.result?.recommendations) ||
        recommendation.body.result.recommendations.length === 0) {
      return { ok: false, stage: "recommendations", outcome: "unexpected_contract", status: recommendation.status };
    }

    return {
      ok: true,
      origin,
      healthStatus: health.status,
      sessionStatus: session.status,
      recommendationStatus: recommendation.status,
      recommendationCount: recommendation.body.result.recommendations.length,
    };
  }, { corBaseUrl });

  console.log(JSON.stringify({ diagnostic: "noor_real_browser_cor_smoke", ...result }));
  if (!result.ok) {
    throw new Error("noor_real_browser_cor_smoke_failed:" + result.stage + ":" + result.outcome);
  }
} finally {
  await browser.close();
}
