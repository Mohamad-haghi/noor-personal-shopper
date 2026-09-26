import type { Product, Recommendation } from "../domain";
import { getNoorInventoryDestination } from "./noor-inventory-link";

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

  return `<article class="recommendation-card"><div class="recommendation-rank">0${index + 1}</div><div class="recommendation-card-body"><p class="eyebrow">پیشنهاد ${index + 1} · ${recommendation.score.overall}%</p><h2>${escapeHtml(product.name)}</h2><p class="recommendation-reason">${escapeHtml(recommendation.reason.explanation ?? "هماهنگ با انتخاب‌های شما")}</p><dl class="recommendation-specs"><div><dt>فرم</dt><dd>${escapeHtml(shape)}</dd></div><div><dt>جنس</dt><dd>${escapeHtml(material)}</dd></div><div><dt>ابعاد</dt><dd>${escapeHtml(size)}</dd></div></dl><p class="inventory-link-note">شناسه مرجع نور: ${escapeHtml(inventory?.reference ?? "در دسترس نیست")}</p><div class="recommendation-card-actions"><button class="button button-secondary recommendation-save" type="button" data-save-choice="${escapeHtml(recommendation.variantId.id)}">ذخیره در انتخاب‌های من</button><button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(recommendation.variantId.id)}" data-product-id="${escapeHtml(product.identity.id)}">انتخاب برای خرید</button>${inventoryLink}</div></div></article>`;
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
