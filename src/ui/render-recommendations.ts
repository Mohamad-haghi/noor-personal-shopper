import type { Product, Recommendation } from "../domain";
import { readAppConfig } from "../config/app-config";
import { CorShopperDemoCredentialProvider } from "../integration/cor-shopper-demo-credential-provider";
import { getNoorInventoryDestination } from "./noor-inventory-link";

/** COR's canonical decision engine returns normalized scores in the 0..1 range. */
export function formatRecommendationScore(score: number): string {
  if (!Number.isFinite(score)) return "—";
  const normalized = Math.max(0, Math.min(1, score));
  return String(Math.round(normalized * 100));
}

function escapeHtml(value: string): string { return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\"","&quot;").replaceAll("'","&#039;"); }
function custom(product: Product, key: string): unknown { return product.attributes.customAttributes[key]; }

function card(product: Product, recommendation: Recommendation, index: number): string {
  const shape = Array.isArray(custom(product, "frameShapes")) ? (custom(product, "frameShapes") as string[]).join(" · ") : "—";
  const material = String(custom(product, "frameMaterial") ?? "—");
  const size = [custom(product,"lensWidthMm"), custom(product,"bridgeWidthMm"), custom(product,"templeLengthMm")].every((v) => typeof v === "number")
    ? [custom(product,"lensWidthMm"),custom(product,"bridgeWidthMm"),custom(product,"templeLengthMm")].join(" / ")
    : "—";
  const inventory = getNoorInventoryDestination(product);
  const inventoryLink = inventory
    ? `<a class="button button-secondary" href="${escapeHtml(inventory.url)}" target="_blank" rel="noopener noreferrer">مشاهده در فروشگاه نور</a>`
    : "";

  return `<article class="recommendation-card"><div class="recommendation-rank">0${index + 1}</div><div class="recommendation-card-body"><p class="eyebrow">پیشنهاد ${index + 1} · ${formatRecommendationScore(recommendation.score.overall)}%</p><h2>${escapeHtml(product.name)}</h2><p class="recommendation-reason">${escapeHtml(recommendation.reason.explanation ?? "هماهنگ با انتخاب‌های شما")}</p><dl class="recommendation-specs"><div><dt>فرم</dt><dd>${escapeHtml(shape)}</dd></div><div><dt>جنس</dt><dd>${escapeHtml(material)}</dd></div><div><dt>ابعاد</dt><dd>${escapeHtml(size)}</dd></div></dl><p class="inventory-link-note">شناسه مرجع نور: ${escapeHtml(inventory?.reference ?? "در دسترس نیست")}</p><div class="recommendation-card-actions"><button class="button button-secondary recommendation-save" type="button" data-save-choice="${escapeHtml(recommendation.variantId.id)}">ذخیره در انتخاب‌های من</button><button class="button button-secondary" type="button" data-compare-product="${escapeHtml(recommendation.variantId.id)}" data-product-id="${escapeHtml(product.identity.id)}">افزودن به مقایسه</button><button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(recommendation.variantId.id)}" data-product-id="${escapeHtml(product.identity.id)}">انتخاب برای خرید</button>${inventoryLink}</div></div></article>`;
}

export function renderRecommendations(routeView: HTMLElement, recommendations: readonly Recommendation[], products: readonly Product[]): void {
  const productByVariant = new Map(products.map((product) => [product.identity.id, product]));
  const rows = recommendations.map((recommendation, index) => {
    const product = productByVariant.get(recommendation.variantId.productId.id);
    return product ? { recommendation, product, index } : null;
  }).filter((item): item is { recommendation: Recommendation; product: Product; index: number } => item !== null);

  const compareRows = rows.map(({product}) => {
    const shape = Array.isArray(custom(product,"frameShapes")) ? (custom(product,"frameShapes") as string[]).join(" / ") : "—";
    const category = product.attributes.category === "sunglasses" ? "آفتابی" : "طبی";
    return `<tr><th>${escapeHtml(product.name)}</th><td>${category}</td><td>${escapeHtml(shape)}</td><td>${escapeHtml(String(custom(product,"frameColor") ?? "—"))}</td><td>${escapeHtml(String(custom(product,"uvProtection") ?? "—"))}</td></tr>`;
  }).join("");

  routeView.innerHTML = `<main class="recommendations" id="main-content" aria-labelledby="recommendations-title"><section class="recommendations-hero"><p class="eyebrow">NOOR PERSONAL SHOPPER</p><h1 id="recommendations-title">سه انتخاب برای شروع</h1><p>این سه فریم بر اساس پاسخ‌های همین مشاوره و فقط از میان محصولات Demo در دسترس انتخاب شده‌اند.</p><p class="inventory-link-note">هر لینک فروشگاه نور با شناسه ساختاریافته محصول ساخته می‌شود؛ این Demo به موجودی واقعی متصل نیست.</p></section><section class="recommendation-grid">${rows.map(({recommendation,product,index}) => card(product,recommendation,index)).join("")}</section><section class="smart-comparison" aria-labelledby="smart-comparison-title"><div><p class="eyebrow">SMART COMPARISON</p><h2 id="smart-comparison-title">مقایسهٔ سریع سه انتخاب</h2><p>به‌جای رتبه‌بندی ظاهری، تفاوت‌های اصلی را کنار هم ببینید و انتخاب را محدود کنید.</p></div><div class="comparison-table-wrap"><table><thead><tr><th>فریم</th><th>نوع</th><th>فرم</th><th>رنگ</th><th>UV</th></tr></thead><tbody>${compareRows}</tbody></table></div></section><div class="recommendation-actions"><a class="button button-secondary" href="/shopper" data-app-link>تغییر انتخاب‌ها</a><a class="button button-primary" href="/choices" data-app-link>انتخاب‌های من</a><a class="button button-secondary" href="/compare" data-app-link>مقایسه</a></div></main>`;
}

/**
 * Truthful failure state for when the decision provider (COR in the target
 * integrated composition) cannot return a valid response. Never show local or
 * demo-generated recommendations as a substitute.
 */
export function renderRecommendationsUnavailable(routeView: HTMLElement, diagnosticCode = "cor_recommendation_unavailable"): void {
  const safeCode = /^cor_[a-z0-9_]{1,80}$/.test(diagnosticCode)
    ? diagnosticCode
    : "cor_recommendation_unavailable";
  routeView.innerHTML = `
    <main class="app-error" id="main-content" aria-labelledby="recommendations-unavailable-title">
      <p class="eyebrow">NOOR PERSONAL SHOPPER</p>
      <h1 id="recommendations-unavailable-title">دستیار خرید فعلاً در دسترس نیست</h1>
      <p>پیشنهاد معتبر از سرویس تصمیم‌گیری دریافت نشد؛ برای جلوگیری از راهنمایی اشتباه، پیشنهاد جایگزین نمایش داده نمی‌شود.</p>
      <p>می‌توانید دوباره تلاش کنید یا محصولات فروشگاه را مستقیماً ببینید.</p>
      <p class="diagnostic-code" dir="ltr">کد تشخیصی: ${safeCode}</p>
      <div class="route-actions">
        <button class="button button-primary" type="button" id="retry-recommendations">تلاش دوباره برای دریافت پیشنهادها</button>
        <a class="button button-secondary" href="/shopper" data-app-link>بازگشت به مشاور</a>
        <button class="button button-secondary" type="button" id="cor-connection-diagnostic">بررسی اتصال COR</button>
        <a class="button button-secondary" href="/products" data-app-link>مشاهده محصولات</a>
      </div>
      <p id="cor-connection-diagnostic-result" class="diagnostic-code" dir="ltr" role="status" aria-live="polite" hidden></p>
    </main>
  `;

  const retryButton = routeView.querySelector<HTMLButtonElement>("#retry-recommendations");
  retryButton?.addEventListener("click", () => {
    // Reload the current recommendations route so the decision request runs again.
    window.location.reload();
  });

  const diagnosticButton = routeView.querySelector<HTMLButtonElement>("#cor-connection-diagnostic");
  const diagnosticResult = routeView.querySelector<HTMLElement>("#cor-connection-diagnostic-result");
  diagnosticButton?.addEventListener("click", async () => {
    if (!diagnosticResult || diagnosticButton.disabled) return;
    diagnosticButton.disabled = true;
    diagnosticButton.textContent = "در حال بررسی…";
    diagnosticResult.hidden = false;
    diagnosticResult.textContent = "COR connection check: running";
    const baseUrl = readAppConfig().corBaseUrl;
    if (!baseUrl) {
      diagnosticResult.textContent = "configuration: COR_BASE_URL_MISSING";
      diagnosticButton.disabled = false;
      diagnosticButton.textContent = "بررسی دوباره اتصال";
      return;
    }

    const probe = async (
      path: "/shopper/v1/demo-session" | "/health/live",
      withAbortSignal = false,
    ): Promise<string> => {
      let response: Response;
      const controller = withAbortSignal ? new AbortController() : undefined;
      try {
        response = await fetch(new URL(path, baseUrl).toString(), {
          method: "GET",
          cache: "no-store",
          credentials: "omit",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          ...(controller ? { signal: controller.signal } : {}),
        });
      } catch (error) {
        const name = error instanceof Error ? error.name : "unknown";
        return `FETCH_REJECTED_${name}`;
      }
      const status = response.status;
      try { await response.body?.cancel(); } catch { /* best-effort cleanup */ }
      return response.ok ? `HTTP_${status}` : `HTTP_ERROR_${status}`;
    };

    try {
      const session = await probe("/shopper/v1/demo-session");
      const health = await probe("/health/live");
      const sessionWithSignal = await probe("/shopper/v1/demo-session", true);
      const healthWithSignal = await probe("/health/live", true);

      // Exercise the exact credential provider used by the real recommendation
      // client, including response JSON/schema/expiry validation. Never expose
      // the credential or response body in the diagnostic output.
      const providerController = new AbortController();
      const providerTimer = window.setTimeout(() => providerController.abort(), 15_000);
      let providerResult = "UNKNOWN";
      try {
        const provider = new CorShopperDemoCredentialProvider(baseUrl);
        const credential = await provider.getBearerCredential(providerController.signal);
        providerResult = credential ? "OK" : "EMPTY";
      } catch (error) {
        const code = error instanceof Error ? error.message : "";
        providerResult = /^cor_[a-z0-9_]{1,80}$/.test(code) ? code : "UNEXPECTED_ERROR";
      } finally {
        window.clearTimeout(providerTimer);
      }

      diagnosticResult.textContent =
        `demo-session=${session}; health-live=${health}; signal-demo-session=${sessionWithSignal}; signal-health-live=${healthWithSignal}; actual-provider=${providerResult}`;
    } finally {
      diagnosticButton.disabled = false;
      diagnosticButton.textContent = "بررسی دوباره اتصال";
    }
  });
}
