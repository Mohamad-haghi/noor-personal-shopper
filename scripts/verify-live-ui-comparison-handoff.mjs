import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const pagesUrl = process.env.PAGES_URL ?? "https://mohamad-haghi.github.io/noor-personal-shopper/";
const corBaseUrl = process.env.COR_SHOPPER_BASE_URL ?? "https://digital-sales-core.onrender.com";
const evidencePath = process.env.EVIDENCE_PATH ?? "artifacts/noor-ui-comparison-handoff.json";
const browser = await chromium.launch({ headless: true });
const evidence = {
  schemaVersion: "1.0.0",
  test: "noor-live-ui-comparison-and-product-handoff",
  pagesUrl,
  corBaseUrl,
  startedAt: new Date().toISOString(),
  browser: "chromium",
  steps: {},
  corRequests: [],
  errors: [],
};

try {
  const page = await browser.newPage();
  page.on("request", request => {
    try {
      const url = new URL(request.url());
      if (url.origin !== new URL(corBaseUrl).origin) return;
      const entry = { method: request.method(), path: url.pathname };
      if (["/shopper/v1/comparisons", "/shopper/v1/handoffs"].includes(url.pathname)) {
        try {
          const body = request.postDataJSON();
          entry.requestId = body?.requestId ?? null;
          entry.productIds = body?.productIds ?? (body?.productId ? [body.productId] : []);
        } catch { entry.bodyReadable = false; }
      }
      evidence.corRequests.push(entry);
    } catch { /* ignore non-URL requests */ }
  });
  page.on("pageerror", error => evidence.errors.push(error.message.slice(0, 300)));

  const entry = new URL(pagesUrl);
  entry.searchParams.set("corTrace", "1");
  await page.goto(entry.toString(), { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.getByRole("link", { name: "دستیار خرید" }).first().click();
  await page.getByRole("button", { name: "شروع مشاوره" }).click();

  for (const answer of [
    "عینک آفتابی",
    "رانندگی و فضای باز",
    "خلبانی",
    "بیضی",
    "استات",
    "مشکی",
    "یونیسکس",
  ]) {
    await page.getByRole("button", { name: answer, exact: true }).click();
    await page.getByRole("button", { name: "ادامه", exact: true }).click();
  }

  await page.getByRole("button", { name: "مشاهده مسیر پیشنهادها", exact: true }).click();
  await page.waitForSelector(".recommendation-card", { timeout: 120_000 });
  const cards = page.locator(".recommendation-card");
  const cardCount = await cards.count();
  if (cardCount < 2) throw new Error("ui_comparison_requires_two_recommendation_cards");
  const recommendedIds = [];
  for (let i = 0; i < Math.min(2, cardCount); i += 1) {
    recommendedIds.push(await cards.nth(i).locator("[data-product-id]").getAttribute("data-product-id"));
  }
  evidence.steps.recommendations = { cardCount, selectedProductIds: recommendedIds };

  for (let i = 0; i < 2; i += 1) {
    const button = cards.nth(i).locator("[data-compare-product]");
    await button.click();
    await page.waitForFunction(
      (index) => document.querySelectorAll(".recommendation-card [data-compare-product]")[index]?.textContent?.includes("به مقایسه اضافه شد"),
      i,
      { timeout: 15_000 },
    );
  }
  const compareResponsePromise = page.waitForResponse(response => {
    const request = response.request();
    return new URL(response.url()).pathname === "/shopper/v1/comparisons" && request.method() === "POST";
  }, { timeout: 90_000 });
  await page.getByRole("link", { name: "مشاهده مقایسه", exact: true }).click();
  await page.waitForSelector("#compare-title", { timeout: 30_000 });
  const compareResponse = await compareResponsePromise;
  const compareBody = await compareResponse.json();
  const compareRequest = compareResponse.request().postDataJSON();
  const compareTable = await page.locator(".d5-compare-table").innerText();
  if (!compareResponse.ok() ||
      compareBody?.contractVersion !== "1.0.0" ||
      compareBody?.requestId !== compareRequest?.requestId ||
      compareBody?.result?.source !== "cor_canonical_engine" ||
      compareBody?.result?.demoOnly !== true ||
      !Array.isArray(compareBody?.result?.comparison?.productIds) ||
      compareBody.result.comparison.productIds.length !== 2) {
    throw new Error("live_ui_comparison_cor_contract_failed");
  }
  for (const id of recommendedIds) {
    if (!compareBody.result.comparison.productIds.includes(id)) {
      throw new Error("live_ui_comparison_product_id_mismatch");
    }
  }
  if (!compareTable.includes("فرم فریم") || !compareTable.includes("جنس")) {
    throw new Error("live_ui_comparison_table_missing_expected_attributes");
  }
  evidence.steps.comparison = {
    uiTitle: await page.locator("#compare-title").innerText(),
    tableContainsShapeAndMaterial: true,
    productIds: compareBody.result.comparison.productIds,
    api: {
      status: compareResponse.status(),
      requestId: compareBody.requestId,
      source: compareBody.result.source,
      demoOnly: compareBody.result.demoOnly,
      productCount: compareBody.result.comparison.productIds.length,
    },
  };

  const handoffResponsePromise = page.waitForResponse(response => {
    const request = response.request();
    return new URL(response.url()).pathname === "/shopper/v1/handoffs" && request.method() === "POST";
  }, { timeout: 90_000 });
  await page.locator("[data-add-to-cart]").first().click();
  const handoffResponse = await handoffResponsePromise;
  const handoffBody = await handoffResponse.json();
  const handoffRequest = handoffResponse.request().postDataJSON();
  await page.getByRole("link", { name: "ادامه در فروشگاه نور", exact: true }).waitFor({ state: "visible", timeout: 30_000 });
  const storeLink = page.getByRole("link", { name: "ادامه در فروشگاه نور", exact: true }).first();
  const destination = await storeLink.getAttribute("href");
  const parsedDestination = new URL(destination);
  if (!handoffResponse.ok() ||
      handoffBody?.contractVersion !== "1.0.0" ||
      handoffBody?.requestId !== handoffRequest?.requestId ||
      handoffBody?.result?.source !== "cor_canonical_engine" ||
      handoffBody?.result?.demoOnly !== true ||
      !handoffBody?.result?.handoff ||
      parsedDestination.protocol !== "https:" ||
      parsedDestination.origin !== "https://www.nooroptic.com") {
    throw new Error("live_ui_product_handoff_cor_contract_failed");
  }
  evidence.steps.productHandoff = {
    productId: handoffRequest?.productId ?? null,
    destinationType: handoffRequest?.destinationType ?? null,
    storeLinkVisible: true,
    destinationOrigin: parsedDestination.origin,
    api: {
      status: handoffResponse.status(),
      requestId: handoffBody.requestId,
      source: handoffBody.result.source,
      demoOnly: handoffBody.result.demoOnly,
      handoffReturned: true,
    },
    demoCartNoticeVisible: await page.getByText("سبد خرید نمایشی آماده است؛ این مرحله خرید یا پرداخت واقعی انجام نمی‌دهد.").isVisible().catch(() => false),
  };

  if (evidence.errors.length) throw new Error("browser_page_errors_detected");
  evidence.status = "passed";
} catch (error) {
  evidence.status = "failed";
  evidence.failure = error instanceof Error ? error.message : "unknown_error";
  throw error;
} finally {
  evidence.finishedAt = new Date().toISOString();
  await mkdir("artifacts", { recursive: true });
  await writeFile(evidencePath, JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify(evidence, null, 2));
  await browser.close();
}
