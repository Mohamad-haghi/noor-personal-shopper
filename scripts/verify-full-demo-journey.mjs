import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const pagesUrl = process.env.PAGES_URL;
const evidencePath = process.env.EVIDENCE_PATH ?? "artifacts/noor-full-demo-journey.json";
if (!pagesUrl) throw new Error("full_demo_journey_pages_url_missing");

const evidence = {
  schemaVersion: "1.0.0",
  test: "noor-full-demo-journey-and-route-audit",
  pagesUrl,
  startedAt: new Date().toISOString(),
  browser: "chromium",
  routeChecks: [],
  journey: {},
  errors: [],
  consoleErrors: [],
  spaFallbackResponses: [],
  resourceFailures: [],
};
const browser = await chromium.launch({ headless: true });

try {
  const feedResponse = await fetch(new URL("catalog-feed.json", pagesUrl), { cache: "no-store" });
  if (!feedResponse.ok) throw new Error("demo_catalog_feed_unavailable:" + feedResponse.status);
  const feed = await feedResponse.json();
  if (feed?.demoOnly !== true || !Array.isArray(feed.products) || feed.products.length !== 15) {
    throw new Error("demo_catalog_feed_contract_invalid");
  }
  const productIds = feed.products.map((product) => product?.id).filter((id) => typeof id === "string" && id.trim());
  if (productIds.length !== 15) throw new Error("demo_catalog_feed_product_identity_missing");

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const appBasePath = new URL(pagesUrl).pathname.endsWith("/")
    ? new URL(pagesUrl).pathname
    : new URL(pagesUrl).pathname + "/";
  const navigateSpa = async (route) => {
    const path = route === "/" ? appBasePath : appBasePath + route.slice(1);
    await page.evaluate((destination) => {
      window.history.pushState(null, "", destination);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, path);
    await page.locator("#main-content").waitFor({ state: "attached", timeout: 30_000 });
  };
  page.on("pageerror", error => evidence.errors.push(error.message.slice(0, 300)));
  page.on("console", message => {
    if (message.type() === "error") {
      evidence.consoleErrors.push({ text: message.text().slice(0, 300), location: message.location() });
    }
  });
  page.on("response", response => {
    if (response.status() < 400) return;
    const request = response.request();
    const responseUrl = new URL(response.url());
    const isGitHubPagesSpaFallback =
      response.status() === 404 &&
      request.resourceType() === "document" &&
      responseUrl.origin === new URL(pagesUrl).origin &&
      responseUrl.pathname.startsWith(appBasePath);
    if (isGitHubPagesSpaFallback) {
      evidence.spaFallbackResponses.push(response.url());
    } else {
      evidence.resourceFailures.push({ status: response.status(), url: response.url(), resourceType: request.resourceType() });
    }
  });

  const routeCases = [
    ["/", "خانه"],
    ["/how-it-works", "how-it-works"],
    ["/catalog", "مجموعه"],
    ["/product/" + encodeURIComponent(productIds[0]), "جزئیات محصول"],
    ["/profile", "profile"],
    ["/search", "جست‌وجوی فریم"],
    ["/products", "محصولات"],
    ["/products/" + encodeURIComponent(productIds[0]), "جزئیات محصول"],
    ["/shopper", "shopper"],
    ["/manager", "manager"],
    ["/recommendations", "recommendations"],
    ["/choices", "choices"],
    ["/compare", "compare"],
    ["/account", "حساب کاربری"],
    ["/cart", "سبد خرید"],
    ["/checkout", "تکمیل سفارش"],
    ["/confirmation/noor-e2e-missing-confirmation", "تأیید سفارش"],
    ["/branches", "شعب"],
    ["/visit", "visit"],
  ];

  for (const [route, label] of routeCases) {
    const url = new URL(route.replace(/^\//, ""), pagesUrl);
    await page.goto(url.toString(), { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("#main-content").waitFor({ state: "attached", timeout: 30_000 });
    const firstLoad = await page.locator("#main-content").count();
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("#main-content").waitFor({ state: "attached", timeout: 30_000 });
    const afterReload = await page.locator("#main-content").count();
    if (firstLoad !== 1 || afterReload !== 1) throw new Error("route_direct_load_or_refresh_failed:" + route);
    evidence.routeChecks.push({ route, label, directLoad: true, refresh: true });
  }
  evidence.routeAudit = { registeredRouteCount: routeCases.length, passed: evidence.routeChecks.length };

  // Select the first demo catalog product that actually exposes a purchasable demo variant.
  // Navigate by its canonical product identity so the test exercises the same deep link as the app.
  let selectedProductId = null;
  for (const candidateId of productIds) {
    const productUrl = new URL("products/" + encodeURIComponent(candidateId), pagesUrl);
    await page.goto(productUrl.toString(), { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("#product-title").waitFor({ state: "visible", timeout: 20_000 });
    if (await page.locator("[data-add-to-cart]").count()) {
      selectedProductId = candidateId;
      break;
    }
  }
  if (!selectedProductId) throw new Error("no_demo_product_has_a_purchasable_variant");
  evidence.journey.selectedProductId = selectedProductId;
  const addButton = page.locator("[data-add-to-cart]").first();
  await addButton.waitFor({ state: "visible", timeout: 15_000 });
  await addButton.click();
  await page.getByText("به سبد خرید دمو اضافه شد", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByRole("link", { name: "مشاهدهٔ سبد خرید", exact: true }).click();
  const increment = page.locator("[data-cart-quantity-change][data-quantity-delta='1']").first();
  await increment.waitFor({ state: "visible", timeout: 15_000 });
  await increment.click();
  await page.locator(".lab-cart-quantity-control strong").first().getByText("2", { exact: true }).waitFor({ timeout: 15_000 });
  await page.locator("[data-cart-quantity-change][data-quantity-delta='-1']").first().click();
  await page.locator(".lab-cart-quantity-control strong").first().getByText("1", { exact: true }).waitFor({ timeout: 15_000 });
  evidence.journey.cartQuantity = { increment: "1→2", decrement: "2→1", passed: true };

  await page.getByRole("link", { name: "ادامهٔ تکمیل سفارش نمایشی", exact: true }).click();
  await page.getByRole("link", { name: "ورود / ثبت‌نام", exact: true }).click();
  const email = "noor-e2e-" + Date.now() + "@example.test";
  await page.locator("[data-account-register] input[name='firstName']").fill("Demo");
  await page.locator("[data-account-register] input[name='lastName']").fill("Tester");
  await page.locator("[data-account-register] input[name='email']").fill(email);
  await page.locator("[data-account-register] input[name='password']").fill("NoorDemo123!");
  await page.locator("[data-account-register] button[type='submit']").click();
  await page.getByRole("heading", { name: "حساب کاربری من" }).waitFor({ timeout: 20_000 });

  await navigateSpa("/cart");
  await page.getByRole("link", { name: "ادامهٔ تکمیل سفارش نمایشی", exact: true }).click();
  await page.locator("[data-checkout-form]").waitFor({ state: "visible", timeout: 20_000 });
  await page.locator("#checkout-recipient-name").fill("Demo Tester");
  await page.locator("#checkout-phone").fill("09120000000");
  await page.locator("#checkout-address").fill("خیابان نمونه، پلاک ۱");
  await page.locator("#checkout-city").fill("تهران");
  await page.locator("#checkout-state").fill("تهران");
  await page.locator("#checkout-postal-code").fill("1234567890");
  await page.locator("[data-checkout-form] button[type='submit']").click();
  await page.getByRole("heading", { name: "پرداخت سفارش" }).waitFor({ timeout: 20_000 });

  await page.locator("[data-simulate-failure]").check();
  await page.locator("[data-demo-pay]").click();
  await page.getByRole("heading", { name: "پرداخت انجام نشد" }).waitFor({ timeout: 20_000 });
  await page.getByRole("button", { name: "تلاش دوباره", exact: true }).click();
  await page.getByRole("heading", { name: "پرداخت سفارش" }).waitFor({ timeout: 20_000 });
  await page.locator("[data-demo-pay]").click();
  await page.getByRole("heading", { name: "سفارش شما با موفقیت تأیید شد" }).waitFor({ timeout: 20_000 });
  if (!(await page.getByText("تأیید شده در Demo", { exact: true }).isVisible())) {
    throw new Error("order_confirmation_status_missing");
  }
  evidence.journey.accountRegistration = { passed: true, accountType: "demo" };
  evidence.journey.deliveryCheckout = { passed: true, paymentFailureRecovery: true, orderConfirmation: true };

  await navigateSpa("/cart");
  await page.getByRole("heading", { name: "سبد خرید", exact: true }).waitFor({ timeout: 15_000 });
  await page.getByText("سبد خرید شما خالی است.", { exact: true }).waitFor({ timeout: 15_000 });
  evidence.journey.cartClearedAfterConfirmation = true;

  // Repeat the order journey with branch pickup and exercise the branch visit request.
  await page.goto(new URL("products/" + encodeURIComponent(selectedProductId), pagesUrl).toString(), { waitUntil: "domcontentloaded" });
  await page.locator("[data-add-to-cart]").first().waitFor({ state: "visible", timeout: 30_000 });
  await page.locator("[data-add-to-cart]").first().click();
  await page.getByText("به سبد خرید دمو اضافه شد", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByRole("link", { name: "مشاهدهٔ سبد خرید", exact: true }).click();
  await page.getByRole("link", { name: "ادامهٔ تکمیل سفارش نمایشی", exact: true }).click();
  await page.locator("[data-checkout-form]").waitFor({ state: "visible", timeout: 20_000 });
  await page.locator("#checkout-recipient-name").fill("Demo Tester");
  await page.locator("#checkout-phone").fill("09120000000");
  await page.locator("input[name='fulfillment'][value='pickup']").check();
  await page.locator("[data-pickup-fields]").waitFor({ state: "visible", timeout: 10_000 });
  const pickupBranch = page.locator("#checkout-branch-id");
  if (await pickupBranch.locator("option").count() < 2) throw new Error("pickup_branch_options_missing");
  await pickupBranch.selectOption({ index: 1 });
  await page.locator("[data-checkout-form] button[type='submit']").click();
  await page.getByRole("heading", { name: "پرداخت سفارش" }).waitFor({ timeout: 20_000 });
  await page.locator("[data-demo-pay]").click();
  await page.getByRole("heading", { name: "سفارش شما با موفقیت تأیید شد" }).waitFor({ timeout: 20_000 });
  evidence.journey.pickupCheckout = { passed: true };

  await navigateSpa("/branches");
  await page.getByRole("link", { name: "انتخاب این شعبه" }).first().click();
  await page.locator("[data-visit-form]").waitFor({ state: "visible", timeout: 20_000 });
  const visitTime = page.locator("#visit-time");
  if (await visitTime.locator("option").count() < 2) throw new Error("visit_time_options_missing");
  await visitTime.selectOption({ index: 1 });
  await page.locator("[data-visit-form] button[type='submit']").click();
  await page.getByRole("heading", { name: "درخواست مراجعه ثبت شد." }).waitFor({ timeout: 20_000 });
  evidence.journey.branchVisitRequest = { passed: true };

  if (evidence.errors.length) throw new Error("browser_page_errors_detected:" + evidence.errors.join(" | "));
  if (evidence.resourceFailures.length) {
    throw new Error("unexpected_http_resource_failures:" + JSON.stringify(evidence.resourceFailures));
  }
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
