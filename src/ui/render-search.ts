import type { Product, SearchResponse } from "../domain";
import { productFavoriteControl } from "./product-favorite-control";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function categoryLabel(product: Product): string {
  if (product.attributes.category === "optical" || product.attributes.category === "eyeglasses") return "عینک طبی";
  if (product.attributes.category === "sunglasses") return "عینک آفتابی";
  return "فریم";
}

function card(product: Product, reason: string): string {
  const primaryImage = product.media?.primaryImage;
  const image = primaryImage
    ? `<img src="${escapeHtml(primaryImage.url)}" alt="${escapeHtml(primaryImage.altText ?? product.name)}" loading="lazy">`
    : '<div class="product-media-placeholder" aria-hidden="true">NOOR</div>';
  const href = `/products/${encodeURIComponent(product.identity.id)}`;
  return `
    <article class="product-card lab-search-product-card">
      <a class="product-card-media lab-search-product-media" href="${href}" data-app-link aria-label="جزئیات ${escapeHtml(product.name)}">${image}</a>
      ${productFavoriteControl(product.identity.id)}
      <div class="product-card-body">
        <p class="eyebrow">${escapeHtml(categoryLabel(product))}</p>
        <h2><a href="${href}" data-app-link>${escapeHtml(product.name)}</a></h2>
        <p class="lab-search-reason">${escapeHtml(reason)}</p>
        <div class="product-card-actions"><a class="button button-secondary" href="${href}" data-app-link>جزئیات محصول</a></div>
      </div>
    </article>
  `;
}

export function renderSearch(
  routeView: HTMLElement,
  response: SearchResponse,
  products: readonly Product[],
  similarProducts: readonly Product[] = [],
): void {
  const byId = new Map(products.map((product) => [product.identity.id, product]));
  const results = response.results.map((result) => {
    const product = byId.get(result.productId.id);
    return product ? card(product, result.reasons[0] ?? "بر اساس اطلاعات ساختاریافتهٔ فریم پیدا شد") : "";
  }).join("");
  const query = response.query.text.trim();
  const similarMarkup = similarProducts.length
    ? `<section class="search-similar lab-search-similar"><p class="eyebrow" dir="ltr">SIMILAR FRAMES</p><h2>فریم‌های مشابه</h2><div class="product-grid lab-search-grid">${similarProducts.map((product) => card(product, "فریم مشابه بر اساس DNA ساختاری")).join("")}</div></section>`
    : "";
  const empty = response.total === 0 && query
    ? `<section class="search-empty lab-search-empty"><h2>نتیجه‌ای پیدا نشد</h2><p>عبارت را کوتاه‌تر کنید یا از واژه‌هایی مثل «طبی»، «آفتابی»، «مشکی»، «کلاسیک» یا فرم فریم استفاده کنید.</p><a class="button button-primary" href="/shopper?from=search" data-app-link>رفتن به مشاور انتخاب عینک</a></section>`
    : "";
  const meta = response.total
    ? `${response.total} نتیجه برای «${escapeHtml(query)}»`
    : query ? "بدون نتیجه" : "جست‌وجوی کنترل‌شده، بدون AI/LLM";

  routeView.innerHTML = `
    <main class="search-page lab-search-page" id="main-content" aria-labelledby="search-title">
      <header class="search-intro lab-search-head">
        <p class="eyebrow" dir="ltr">NOOR · SMART DISCOVERY</p>
        <h1 id="search-title">جست‌وجوی فریم</h1>
        <p>با جست‌وجوی ساختاریافته در کاتالوگ نمایشی، فریم‌هایی را پیدا کنید که به عبارت شما نزدیک‌تر هستند.</p>
        <form class="search-form lab-search-form" data-search-form role="search">
          <label for="search-input">چه فریمی در ذهن دارید؟</label>
          <div class="search-form-row lab-search-form-row">
            <input id="search-input" name="q" value="${escapeHtml(query)}" placeholder="مثلاً عینک طبی مشکی کلاسیک" autocomplete="off">
            <button class="button button-primary" type="submit">جست‌وجو</button>
          </div>
        </form>
        <p class="search-meta lab-search-meta">${meta}</p>
        ${query ? `<a class="search-shopper-handoff" href="/shopper?from=search&amp;query=${encodeURIComponent(query)}" data-app-link>این انتخاب را با مشاور نور ادامه بده</a>` : ""}
      </header>
      ${empty}
      ${results ? `<section class="search-results lab-search-results" aria-label="نتایج جست‌وجو"><div class="product-grid lab-search-grid">${results}</div></section>` : ""}
      ${similarMarkup}
    </main>
  `;
}
