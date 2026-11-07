import type { Product, Recommendation } from "../domain";
import { readAppConfig } from "../config/app-config";
import { CorShopperDemoCredentialProvider } from "../integration/cor-shopper-demo-credential-provider";
import { getNoorInventoryDestination } from "./noor-inventory-link";
import { productFavoriteControl } from "./product-favorite-control";

/** COR's canonical decision engine returns normalized scores in the 0..1 range. */
/** Human-readable labels based on the number of renderable recommendation cards. */
export function recommendationCountLabel(count: number): string {
  const safeCount = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
  if (safeCount === 1) return "یک پیشنهاد";
  if (safeCount === 2) return "دو پیشنهاد";
  if (safeCount === 3) return "سه پیشنهاد";
  return `${safeCount} پیشنهاد`;
}

export function recommendationHeadline(count: number): string {
  if (count === 1) return "یک پیشنهاد برای شروع";
  if (count === 2) return "دو پیشنهاد برای شروع";
  if (count === 3) return "سه پیشنهاد برای شروع";
  return `${Math.max(0, Math.floor(Number.isFinite(count) ? count : 0))} پیشنهاد برای شروع`;
}

export function formatRecommendationScore(score: number): string {
  if (!Number.isFinite(score)) return "—";
  const normalized = Math.max(0, Math.min(1, score));
  return String(Math.round(normalized * 100));
}

/** Label the normalized COR score without implying a calibrated probability. */
export function formatRecommendationScoreLabel(score: number): string {
  return `امتیاز تطابق ${formatRecommendationScore(score)}%`;
}

function escapeHtml(value: string): string { return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\"","&quot;").replaceAll("'","&#039;"); }
function custom(product: Product, key: string): unknown { return product.attributes.customAttributes[key]; }

function productImage(product: Product): string {
  const image = product.media.primaryImage;
  return image
    ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? product.name)}" loading="lazy">`
    : `<div class="lab-recommendation-image-placeholder" aria-hidden="true">NOOR</div>`;
}

function card(product: Product, recommendation: Recommendation, index: number): string {
  const shape = Array.isArray(custom(product, "frameShapes"))
    ? (custom(product, "frameShapes") as string[]).join(" · ")
    : "—";
  const material = String(custom(product, "frameMaterial") ?? "—");
  const dimensions = [custom(product, "lensWidthMm"), custom(product, "bridgeWidthMm"), custom(product, "templeLengthMm")];
  const size = dimensions.every((value) => typeof value === "number" && Number.isFinite(value))
    ? dimensions.join(" / ")
    : "—";
  const inventory = getNoorInventoryDestination(product);
  const inventoryLink = inventory
    ? `<a class="button button-secondary" href="${escapeHtml(inventory.url)}" target="_blank" rel="noopener noreferrer">مشاهده در فروشگاه نور</a>`
    : "";
  const score = formatRecommendationScore(recommendation.score.overall);
  const scoreValue = Number.isFinite(recommendation.score.overall)
    ? Math.round(Math.max(0, Math.min(1, recommendation.score.overall)) * 100)
    : 0;
  const explanation = recommendation.reason.explanation?.trim() || "این پیشنهاد بر اساس معیارهای ثبت‌شده در همین مشاوره انتخاب شده است.";
  const productHref = `/products/${encodeURIComponent(product.identity.id)}`;

  return `
    <li class="lab-recommendation-item">
      <article class="lab-recommendation-card recommendation-card">
        <div class="lab-recommendation-media-wrap">
        <a class="lab-recommendation-media" href="${productHref}" data-app-link aria-label="مشاهده جزئیات ${escapeHtml(product.name)}">
          ${productImage(product)}
          <span class="lab-recommendation-rank" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
        </a>
        ${productFavoriteControl(product.identity.id)}
        </div>
        <div class="lab-recommendation-content recommendation-card-body">
          <div class="lab-recommendation-product-heading">
            <div>
              <p class="eyebrow">پیشنهاد ${index + 1} · ${formatRecommendationScoreLabel(recommendation.score.overall)}</p>
              <h2>${escapeHtml(product.name)}</h2>
            </div>
            <div class="lab-recommendation-score" aria-label="امتیاز تطابق ${score} از ۱۰۰">
              <p><strong>${score}</strong><span>/100</span></p>
              <small>امتیاز تطابق COR</small>
            </div>
          </div>
          <div class="lab-recommendation-score-track" role="progressbar" aria-label="امتیاز تطابق COR" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${scoreValue}">
            <span style="width: ${scoreValue}%"></span>
          </div>
          <p class="lab-recommendation-reason">${escapeHtml(explanation)}</p>
          <dl class="lab-recommendation-specs">
            <div><dt>فرم فریم</dt><dd>${escapeHtml(shape)}</dd></div>
            <div><dt>جنس فریم</dt><dd>${escapeHtml(material)}</dd></div>
            <div><dt>ابعاد عدسی / پل / دسته</dt><dd>${escapeHtml(size)}</dd></div>
          </dl>
          <p class="inventory-link-note">شناسه مرجع نور: ${escapeHtml(inventory?.reference ?? "در دسترس نیست")}</p>
          <div class="lab-recommendation-card-actions">
            <button class="button button-secondary" type="button" data-compare-product="${escapeHtml(recommendation.variantId.id)}" data-product-id="${escapeHtml(product.identity.id)}">افزودن به مقایسه</button>
            <button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(recommendation.variantId.id)}" data-product-id="${escapeHtml(product.identity.id)}">انتخاب برای خرید</button>
            ${inventoryLink}
            <a class="button button-secondary" href="${productHref}" data-app-link>جزئیات محصول</a>
          </div>
        </div>
      </article>
    </li>
  `;
}

export function renderRecommendations(routeView: HTMLElement, recommendations: readonly Recommendation[], products: readonly Product[]): void {
  const productByVariant = new Map(products.map((product) => [product.identity.id, product]));
  const rows = recommendations.map((recommendation, index) => {
    const product = productByVariant.get(recommendation.variantId.productId.id);
    return product ? { recommendation, product, index } : null;
  }).filter((item): item is { recommendation: Recommendation; product: Product; index: number } => item !== null);

  const count = rows.length;
  const cards = rows.map(({ recommendation, product, index }) => card(product, recommendation, index)).join("");
  const emptyState = count === 0
    ? `<section class="lab-recommendations-empty" role="status"><h2>پیشنهادی برای نمایش در دسترس نیست.</h2><p>برای دریافت پیشنهادهای معتبر، دوباره به مشاوره برگردید و درخواست را اجرا کنید.</p><a class="button button-primary" href="/shopper" data-app-link>بازگشت به مشاوره</a></section>`
    : `<ol class="lab-recommendations-list" aria-label="پیشنهادهای مرتب‌شده بر اساس امتیاز COR">${cards}</ol>`;

  routeView.innerHTML = `
    <main class="lab-recommendations-page" id="main-content" aria-labelledby="recommendations-title">
      <header class="lab-recommendations-head">
        <p class="eyebrow" dir="ltr">NOOR PERSONAL SHOPPER · COR</p>
        <h1 id="recommendations-title">${count === 1 ? "پیشنهاد شما" : "پیشنهادهای شما"}</h1>
        <p>نتایج این صفحه بر اساس پاسخ‌های همین مشاوره و از میان محصولات Demo در دسترس نمایش داده می‌شوند.</p>
      </header>
      <div class="lab-recommendations-notes">
        <p class="lab-recommendation-note" role="note">امتیاز نمایش‌داده‌شده، امتیاز تطابق نرمال‌شدهٔ موتور تصمیم‌گیری COR است؛ احتمال آماری تناسب یا تضمین تناسب فیزیکی محصول نیست.</p>
        <p class="lab-recommendation-note" role="note">این نسخه نمایشی به موجودی، قیمت، سفارش یا پرداخت واقعی NOOR متصل نیست. اطلاعات نامشخص محصول حدس زده نمی‌شود.</p>
      </div>
      ${emptyState}
      <nav class="lab-recommendations-actions" aria-label="ادامه مسیر انتخاب">
        <a class="button button-primary" href="/choices" data-app-link>انتخاب‌های من</a>
        <a class="button button-secondary" href="/compare" data-app-link>مقایسه فریم‌ها</a>
        <a class="button button-secondary" href="/shopper" data-app-link>تغییر معیارهای انتخاب</a>
      </nav>
    </main>
  `;
}

/** Human-readable labels for criteria the shopper explicitly marked as mandatory. */
export function mandatoryCriteriaLabels(criteria: readonly string[]): string[] {
  const labels: Record<string, string> = {
    frameShape: "فرم فریم",
    frameMaterial: "جنس فریم",
    frameColor: "رنگ فریم",
  };
  return [...new Set(criteria)].map((criterion) => labels[criterion] ?? criterion);
}

/** Truthful empty state when COR returned no eligible products for mandatory criteria. */
export function renderMandatoryCriteriaNoMatch(
  routeView: HTMLElement,
  criteria: readonly string[],
): void {
  const labels = mandatoryCriteriaLabels(criteria);
  const criteriaText = labels.length
    ? labels.map(escapeHtml).join("، ")
    : "شرط‌های اجباری شما";
  routeView.innerHTML = `
    <main class="app-error" id="main-content" aria-labelledby="mandatory-no-match-title">
      <p class="eyebrow">NOOR PERSONAL SHOPPER</p>
      <h1 id="mandatory-no-match-title">محصول منطبق با شرط‌های اجباری پیدا نشد</h1>
      <p>موتور تصمیم‌گیری COR هیچ محصول معتبری پیدا نکرد که تمام شرط‌های اجباری انتخاب‌شده را برآورده کند.</p>
      <p>شرط‌های اجباری شما: <strong>${criteriaText}</strong></p>
      <p>برای جلوگیری از پیشنهاد گمراه‌کننده، محصول ناسازگار نمایش داده نمی‌شود. می‌توانید به مشاور برگردید و یکی از شرط‌های اجباری را تغییر دهید یا غیرفعال کنید.</p>
      <div class="route-actions">
        <a class="button button-primary" href="/shopper" data-app-link>تغییر انتخاب‌ها</a>
        <a class="button button-secondary" href="/products" data-app-link>مشاهده همه محصولات آزمایشی</a>
      </div>
    </main>
  `;
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
