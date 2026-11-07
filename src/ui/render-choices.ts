import type { Product, SavedChoice } from "../domain";
import { getNoorInventoryDestination } from "./noor-inventory-link";
import { productFavoriteControl } from "./product-favorite-control";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function custom(product: Product, key: string): unknown {
  return product.attributes.customAttributes[key];
}

function displayFact(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    const values = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    return values.length ? values.join(" · ") : "—";
  }
  return "—";
}

function productImage(product: Product): string {
  const image = product.media.primaryImage;
  return image
    ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? product.name)}" loading="lazy">`
    : `<div class="lab-choice-image-placeholder" aria-hidden="true">NOOR</div>`;
}

function categoryLabel(product: Product): string {
  return product.attributes.category === "sunglasses" ? "عینک آفتابی" : "عینک طبی";
}

export function renderChoices(
  routeView: HTMLElement,
  choices: readonly SavedChoice[],
  products: readonly Product[],
): void {
  const productByVariant = new Map(products.map((product) => [product.identity.id, product]));
  const rows = choices.map((choice) => ({
    choice,
    product: productByVariant.get(choice.variantId.productId.id),
  })).filter((item): item is { choice: SavedChoice; product: Product } => Boolean(item.product));

  const cards = rows.map(({ choice, product }) => {
    const inventory = getNoorInventoryDestination(product);
    const productHref = `/products/${encodeURIComponent(product.identity.id)}`;
    const description = product.description?.trim() || "اطلاعات تکمیلی این فریم در کاتالوگ نمایشی ثبت نشده است.";
    return `
      <article class="lab-choice-card">
        <a class="lab-choice-media" href="${productHref}" data-app-link aria-label="مشاهده جزئیات ${escapeHtml(product.name)}">
          ${productImage(product)}
        </a>
        ${productFavoriteControl(product.identity.id)}
        <div class="lab-choice-content">
          <p class="eyebrow">${escapeHtml(categoryLabel(product))} · انتخاب ذخیره‌شده</p>
          <h2>${escapeHtml(product.name)}</h2>
          <p class="lab-choice-description">${escapeHtml(description)}</p>
          <dl class="lab-choice-facts">
            <div><dt>فرم فریم</dt><dd>${escapeHtml(displayFact(custom(product, "frameShapes")))}</dd></div>
            <div><dt>جنس فریم</dt><dd>${escapeHtml(displayFact(custom(product, "frameMaterial")))}</dd></div>
            <div><dt>رنگ فریم</dt><dd>${escapeHtml(displayFact(custom(product, "frameColor")))}</dd></div>
          </dl>
          <p class="lab-choice-reference">شناسه مرجع نور: ${escapeHtml(inventory?.reference ?? "در دسترس نیست")}</p>
          <div class="lab-choice-actions">
            <button class="button button-secondary" type="button" data-remove-choice="${escapeHtml(choice.identity.id)}">حذف از انتخاب‌ها</button>
            <button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(choice.variantId.id)}" data-product-id="${escapeHtml(choice.variantId.productId.id)}">انتخاب برای خرید</button>
            <a class="button button-secondary" href="/compare" data-app-link>مقایسه</a>
            <a class="button button-secondary" href="${productHref}" data-app-link>جزئیات محصول</a>
            ${inventory ? `<a class="button button-secondary" href="${escapeHtml(inventory.url)}" target="_blank" rel="noopener noreferrer">مشاهده در فروشگاه نور</a>` : ""}
          </div>
        </div>
      </article>
    `;
  }).join("");

  routeView.innerHTML = `
    <main class="lab-choices-page" id="main-content" aria-labelledby="choices-title">
      <header class="lab-choices-head">
        <p class="eyebrow" dir="ltr">SAVED CHOICES</p>
        <h1 id="choices-title">انتخاب‌های شما</h1>
        <p>فریم‌هایی که در این جلسهٔ نمایشی ذخیره کرده‌اید، برای مرور، مقایسه و ادامه مسیر در دسترس هستند.</p>
      </header>
      <p class="lab-choices-note" role="note">انتخاب‌ها فقط در همین جلسهٔ Demo نگه داشته می‌شوند. این صفحه به موجودی یا سفارش واقعی NOOR متصل نیست.</p>
      ${rows.length === 0
        ? `<section class="lab-choices-empty" aria-labelledby="choices-empty-title"><h2 id="choices-empty-title">هنوز فریمی ذخیره نکرده‌اید.</h2><p>از صفحه پیشنهادها، فریم‌های موردنظر خود را به انتخاب‌ها اضافه کنید.</p><div class="lab-choices-empty-actions"><a class="button button-primary" href="/recommendations" data-app-link>مشاهده پیشنهادها</a><a class="button button-secondary" href="/products" data-app-link>مشاهده مجموعه</a></div></section>`
        : `<section class="lab-choices-grid" aria-label="فریم‌های ذخیره‌شده">${cards}</section><nav class="lab-choices-footer-actions" aria-label="ادامه مسیر انتخاب"><a class="button button-primary" href="/compare" data-app-link>مقایسه انتخاب‌های من</a><a class="button button-secondary" href="/recommendations" data-app-link>بازگشت به پیشنهادها</a></nav>`}
    </main>
  `;
}
