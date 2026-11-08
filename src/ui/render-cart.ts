import type { Cart, Product } from "../domain";
import { productFavoriteControl } from "./product-favorite-control";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " " + (currency === "IRR" ? "ریال" : currency);
}

function productImage(product: Product | undefined): string {
  const image = product?.media?.primaryImage;
  return image
    ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? product.name)}" loading="lazy">`
    : `<div class="lab-cart-image-placeholder" aria-hidden="true">NOOR</div>`;
}

export function renderCart(routeView: HTMLElement, cart: Cart | null, products: readonly Product[]): void {
  if (!cart || cart.items.length === 0) {
    routeView.innerHTML = `
      <main class="lab-cart-page" id="main-content" aria-labelledby="cart-title">
        <header class="lab-cart-head">
          <p class="eyebrow" dir="ltr">DEMO CART</p>
          <h1 id="cart-title">سبد خرید</h1>
          <p>فریم‌های انتخاب‌شده را اینجا مرور کنید. تمام قیمت‌ها و مبالغ این بخش صرفاً نمایشی هستند.</p>
        </header>
        <section class="lab-cart-empty" role="status">
          <h2>سبد خرید شما خالی است.</h2>
          <p>برای شروع، پیشنهادهای COR یا مجموعه محصولات نمایشی را مرور کنید.</p>
          <div class="lab-cart-empty-actions">
            <a class="button button-primary" href="/recommendations" data-app-link>دیدن پیشنهادهای من</a>
            <a class="button button-secondary" href="/products" data-app-link>مشاهده مجموعه</a>
          </div>
        </section>
      </main>
    `;
    return;
  }

  const productById = new Map(products.map((product) => [product.identity.id, product]));
  const rows = cart.items.map((item) => {
    const product = productById.get(item.variantId.productId.id);
    const href = product ? `/products/${encodeURIComponent(product.identity.id)}` : null;
    const media = product
      ? `<a class="lab-cart-media" href="${href}" data-app-link aria-label="جزئیات ${escapeHtml(product.name)}">${productImage(product)}</a>`
      : `<div class="lab-cart-media">${productImage(undefined)}</div>`;
    return `
      <article class="lab-cart-item">
        <div class="lab-cart-media-wrap">${media}${product ? productFavoriteControl(product.identity.id) : ""}</div>
        <div class="lab-cart-item-content">
          <p class="eyebrow">${escapeHtml(item.priceLabel)}</p>
          <h2>${escapeHtml(product?.name ?? "فریم انتخاب‌شده")}</h2>
          <div class="lab-cart-quantity-control" aria-label="تغییر تعداد">
            <span>تعداد</span>
            <button class="button button-secondary" type="button" data-cart-quantity-change="${escapeHtml(item.id)}" data-quantity-delta="-1" aria-label="کاهش تعداد ${escapeHtml(product?.name ?? "فریم انتخاب‌شده")}"${item.quantity <= 1 ? " disabled" : ""}>−</button>
            <strong aria-live="polite">${item.quantity}</strong>
            <button class="button button-secondary" type="button" data-cart-quantity-change="${escapeHtml(item.id)}" data-quantity-delta="1" aria-label="افزایش تعداد ${escapeHtml(product?.name ?? "فریم انتخاب‌شده")}">+</button>
          </div>
          <p class="lab-cart-price">${formatAmount(item.unitPrice * item.quantity, item.currency)}</p>
          ${href ? `<a class="lab-cart-detail-link" href="${href}" data-app-link>جزئیات محصول</a>` : ""}
        </div>
        <div class="lab-cart-item-actions">
          <button class="button button-secondary" type="button" data-cart-remove="${escapeHtml(item.id)}">حذف از سبد</button>
        </div>
      </article>
    `;
  }).join("");

  routeView.innerHTML = `
    <main class="lab-cart-page" id="main-content" aria-labelledby="cart-title">
      <header class="lab-cart-head">
        <p class="eyebrow" dir="ltr">DEMO CART</p>
        <h1 id="cart-title">سبد خرید شما</h1>
        <p>فریم‌های انتخاب‌شده برای ادامه مسیر نمایشی. هیچ سفارش یا پرداخت واقعی در این مرحله انجام نمی‌شود.</p>
      </header>
      <p class="lab-cart-note" role="note">قیمت هر قلم و جمع سبد، مقادیر نمایشی Demo هستند و به قیمت واقعی یا موجودی فروشگاه نور متصل نیستند.</p>
      <section class="lab-cart-list" aria-label="اقلام انتخاب‌شده">
        ${rows}
      </section>
      <section class="lab-cart-summary" aria-label="خلاصه سبد خرید">
        <div><span>تعداد اقلام</span><strong>${cart.itemCount}</strong></div>
        <div><span>جمع نمایشی سبد</span><strong>${formatAmount(cart.subtotal, cart.currency)}</strong></div>
        <p>این جمع فقط برای نمایش مسیر احتمالی خرید استفاده می‌شود و مبلغ قابل پرداخت نیست.</p>
        <a class="button button-primary" href="/checkout" data-app-link>ادامهٔ تکمیل سفارش نمایشی</a>
        <a class="button button-secondary" href="/products" data-app-link>بازگشت به مجموعه</a>
      </section>
    </main>
  `;
}
