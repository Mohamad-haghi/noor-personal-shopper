import type { Product, SavedChoice } from "../domain";
import { getNoorInventoryDestination } from "./noor-inventory-link";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
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

  routeView.innerHTML = `
    <main class="d5-page" id="main-content" aria-labelledby="choices-title">
      <section class="d5-intro">
        <p class="eyebrow">MY CHOICES</p>
        <h1 id="choices-title">انتخاب‌های من</h1>
        <p>فریم‌هایی که در این جلسهٔ Demo ذخیره کرده‌اید، اینجا برای مقایسه و ادامهٔ مسیر در دسترس هستند.</p>
        <p class="inventory-link-note">برای هر فریم، مقصد فروشگاه نور از شناسه ساختاریافته محصول ساخته می‌شود؛ این Demo به موجودی واقعی متصل نیست.</p>
      </section>
      ${rows.length === 0
        ? `<section class="d5-empty"><h2>هنوز انتخابی ذخیره نشده است.</h2><p>از صفحهٔ پیشنهادها، فریم‌های موردنظر خود را ذخیره کنید.</p><a class="button button-primary" href="/recommendations" data-app-link>بازگشت به پیشنهادها</a></section>`
        : `
          <section class="d5-choice-grid" aria-label="انتخاب‌های ذخیره‌شده">
            ${rows.map(({ choice, product }) => {
              const inventory = getNoorInventoryDestination(product);
              return `
              <article class="d5-choice-card">
                <p class="eyebrow">انتخاب ذخیره‌شده</p>
                <h2>${escapeHtml(product.name)}</h2>
                <p>${escapeHtml(product.description ?? "جزئیات این فریم در کاتالوگ Demo ثبت شده است.")}</p>
                <p class="inventory-link-note">شناسه مرجع نور: ${escapeHtml(inventory?.reference ?? "در دسترس نیست")}</p>
                <div class="d5-card-actions">
                  <button class="button button-secondary" type="button" data-remove-choice="${escapeHtml(choice.identity.id)}">حذف</button>
                  <button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(choice.variantId.id)}" data-product-id="${escapeHtml(choice.variantId.productId.id)}">انتخاب برای خرید</button>
                  <a class="button button-secondary" href="/compare" data-app-link>مقایسهٔ انتخاب‌ها</a>
                  ${inventory ? `<a class="button button-secondary" href="${escapeHtml(inventory.url)}" target="_blank" rel="noopener noreferrer">مشاهده در فروشگاه نور</a>` : ""}
                </div>
              </article>
            `; }).join("")}
          </section>
          <div class="d5-actions">
            <a class="button button-primary" href="/compare" data-app-link>مقایسهٔ انتخاب‌های من</a>
            <a class="button button-secondary" href="/recommendations" data-app-link>بازگشت به پیشنهادها</a>
          </div>
        `}
    </main>
  `;
}
