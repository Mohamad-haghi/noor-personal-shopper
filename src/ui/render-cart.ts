import type { Cart, Product } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " " + (currency === "IRR" ? "ریال" : currency);
}

export function renderCart(routeView: HTMLElement, cart: Cart | null, products: readonly Product[]): void {
  if (!cart || cart.items.length === 0) {
    routeView.innerHTML = `<main class="d7-cart-page" id="main-content"><section class="d7-cart-intro"><p class="eyebrow">DEMO CART</p><h1>سبد خرید</h1><p>هنوز محصولی برای خرید انتخاب نکرده‌اید. قیمت‌های این بخش صرفاً نمایشی و مخصوص Demo هستند.</p></section><section class="d7-cart-empty"><h2>سبد خرید شما خالی است.</h2><a class="button button-primary" href="/recommendations" data-app-link>دیدن پیشنهادهای من</a></section></main>`;
    return;
  }

  const productById = new Map(products.map((product) => [product.identity.id, product]));
  const rows = cart.items.map((item) => {
    const product = productById.get(item.variantId.productId.id);
    return `<article class="d7-cart-item"><div><p class="eyebrow">${escapeHtml(item.priceLabel)}</p><h2>${escapeHtml(product?.name ?? "فریم انتخاب‌شده")}</h2><p>تعداد: ${item.quantity}</p><p class="d7-cart-price">${formatAmount(item.unitPrice * item.quantity, item.currency)}</p></div><button class="button button-secondary" type="button" data-cart-remove="${escapeHtml(item.id)}">حذف</button></article>`;
  }).join("");

  routeView.innerHTML = `<main class="d7-cart-page" id="main-content" aria-labelledby="cart-title"><section class="d7-cart-intro"><p class="eyebrow">DEMO CART</p><h1 id="cart-title">سبد خرید</h1><p>قیمت‌ها در این مرحله «قیمت نمایشی Demo» هستند و به قیمت واقعی فروشگاه نور متصل نیستند.</p></section><section class="d7-cart-list">${rows}</section><section class="d7-cart-summary"><div><span>تعداد اقلام</span><strong>${cart.itemCount}</strong></div><div><span>جمع سبد</span><strong>${formatAmount(cart.subtotal, cart.currency)}</strong></div><p>مرحله بعدی این مسیر در D7-C، Checkout و محاسبه نهایی سفارش Demo است.</p></section></main>`;
}
