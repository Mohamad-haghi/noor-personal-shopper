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

  // Exercise the actual NOOR UI and its own integration path, not just direct
  // fetches from the browser context. This catches wiring/configuration issues
  // that an API-only smoke test cannot detect.
  const browserErrors = [];
  const browserWarnings = [];
  const failedRequests = [];
  const corRequests = [];
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    (window).__noorFetchDebug = [];
    window.fetch = async (input, init) => {
      const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const safeUrl = (() => {
        try {
          const url = new URL(rawUrl, window.location.href);
          return url.origin + url.pathname;
        } catch {
          return "invalid_url";
        }
      })();
      try {
        const response = await originalFetch(input, init);
        (window).__noorFetchDebug.push({ url: safeUrl, outcome: "response", status: response.status });
        return response;
      } catch (error) {
        (window).__noorFetchDebug.push({
          url: safeUrl,
          outcome: "rejected",
          errorName: error instanceof Error ? error.name : "unknown",
          errorMessage: error instanceof Error ? error.message.slice(0, 240) : "unknown",
        });
        throw error;
      }
    };
  });
  page.on("console", message => {
    const text = message.text().slice(0, 500);
    if (message.type() === "error") browserErrors.push(text);
    if (message.type() === "warning" && (text.includes("noor.cor.browser_fetch") || text.includes("COR") || text.includes("cor_"))) {
      browserWarnings.push(text);
    }
  });
  page.on("pageerror", error => browserErrors.push("pageerror:" + error.message.slice(0, 400)));
  page.on("requestfailed", request => {
    if (request.url().includes("cor-noor-test.onrender.com")) {
      failedRequests.push({
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText ?? "unknown",
      });
    }
  });
  page.on("request", request => {
    if (request.url().includes("cor-noor-test.onrender.com")) {
      corRequests.push({ url: request.url(), method: request.method() });
    }
  });
  page.on("response", response => {
    if (response.url().includes("cor-noor-test.onrender.com")) {
      corRequests.push({ url: response.url(), method: response.request().method(), status: response.status() });
    }
  });
  await page.goto(pagesUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.getByRole("link", { name: "دستیار خرید" }).first().click();
  await page.getByRole("button", { name: "شروع مشاوره" }).click();

  for (const answer of ["عینک آفتابی", "رانندگی و فضای باز", "کلاسیک و ماندگار", "بیضی"]) {
    await page.getByRole("button", { name: answer, exact: true }).click();
    await page.getByRole("button", { name: "ادامه", exact: true }).click();
  }

  await page.getByRole("button", { name: "مشاهده مسیر پیشنهادها" }).click();
  await page.waitForFunction(
    () => Boolean(document.querySelector("#recommendations-title") ||
                  document.querySelector("#recommendations-unavailable-title")),
    null,
    { timeout: 120_000 },
  );

  const uiResult = await page.evaluate(() => ({
    title: document.querySelector("#recommendations-title")?.textContent?.trim() ?? null,
    diagnostic: document.querySelector(".diagnostic-code")?.textContent?.trim() ?? null,
    recommendationCards: document.querySelectorAll(".recommendation-card").length,
    fetchDebug: ((window).__noorFetchDebug ?? []).slice(-20),
    resourceUrls: performance.getEntriesByType("resource")
      .map(entry => entry.name)
      .filter(name => name.includes("cor-noor-test") || name.includes("shopper/v1") || name.includes("health/live"))
      .slice(-20),
  }));
  console.log(JSON.stringify({
    diagnostic: "noor_real_ui_recommendation_flow",
    ...uiResult,
    browserConsoleErrors: browserErrors.slice(-12),
    browserWarnings: browserWarnings.slice(-12),
    failedRequests,
    corRequests: corRequests.slice(-30),
  }));

  if (!uiResult.title || uiResult.recommendationCards < 1 || uiResult.diagnostic) {
    throw new Error("noor_real_ui_recommendation_flow_failed:" + (uiResult.diagnostic ?? "no_recommendation_cards"));
  }
} finally {
  await browser.close();
}
