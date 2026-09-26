import type { Account, Cart, Order } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(""", "&quot;").replaceAll("'", "&#039;");
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " " + (currency === "IRR" ? "ریال" : currency);
}

export function renderCheckout(
  routeView: HTMLElement,
  cart: Cart | null,
  account: Account | null,
  order: Order | null = null,
  errorMessage: string | null = null,
): void {
  if (order) {
    routeView.innerHTML = `<main class="d7-checkout-page" id="main-content"><section class="d7-checkout-intro"><p class="eyebrow">DEMO ORDER CREATED</p><h1>سفارش آمادهٔ پرداخت است</h1><p>سفارش در Demo ایجاد شد. پرداخت واقعی در D7-D به‌صورت Mock Payment اجرا می‌شود و اتصال درگاه واقعی بعداً در همین مرز PaymentProvider قرار می‌گیرد.</p></section><section class="d7-checkout-summary"><div><span>شناسه سفارش</span><strong>${escapeHtml(order.identity.id)}</strong></div><div><span>جمع کالاها</span><strong>${formatAmount(order.pricing.subtotal, order.pricing.currency)}</strong></div><div><span>هزینه ارسال</span><strong>${formatAmount(order.pricing.shipping, order.pricing.currency)}</strong></div><div><span>مبلغ نهایی Demo</span><strong>${formatAmount(order.pricing.total, order.pricing.currency)}</strong></div></section><p class="d7-demo-note">این مبلغ و اطلاعات خرید، نمایشی و مخصوص Demo هستند؛ قیمت واقعی نور هنوز از سامانهٔ فروش واقعی دریافت نمی‌شود.</p></main>`;
    return;
  }

  if (!cart || cart.items.length === 0) {
    routeView.innerHTML = `<main class="d7-checkout-page" id="main-content"><section class="d7-checkout-intro"><p class="eyebrow">CHECKOUT</p><h1>تکمیل سفارش</h1><p>برای ادامه ابتدا محصولی را به سبد خرید اضافه کنید.</p><a class="button button-primary" href="/recommendations" data-app-link>دیدن پیشنهادها</a></section></main>`;
    return;
  }

  if (!account) {
    routeView.innerHTML = `<main class="d7-checkout-page" id="main-content"><section class="d7-checkout-intro"><p class="eyebrow">CHECKOUT</p><h1>ورود به حساب کاربری</h1><p>برای ثبت سفارش Demo باید با حساب مستقل Personal Shopper وارد شوید.</p><a class="button button-primary" href="/account" data-app-link>ورود / ثبت‌نام</a></section></main>`;
    return;
  }

  routeView.innerHTML = `
    <main class="d7-checkout-page" id="main-content" aria-labelledby="checkout-title">
      <section class="d7-checkout-intro">
        <p class="eyebrow">DEMO CHECKOUT</p>
        <h1 id="checkout-title">تکمیل سفارش</h1>
        <p>مبلغ‌ها «قیمت نمایشی Demo» هستند. ساختار Checkout طوری نگه داشته شده که منبع قیمت و موجودی بعداً از Commerce واقعی نور تأمین شود.</p>
      </section>
      ${errorMessage ? `<p class="d7-form-error" role="alert">${escapeHtml(errorMessage)}</p>` : ""}
      <form class="d7-checkout-form" data-checkout-form>
        <section class="d7-checkout-section">
          <h2>اطلاعات خریدار</h2>
          <label>نام گیرنده<input name="recipientName" required value="${escapeHtml([account.profile.firstName, account.profile.lastName].filter(Boolean).join(" "))}"></label>
          <label>شماره تماس<input name="phone" value="${escapeHtml(account.phone ?? "")}" inputmode="tel"></label>
        </section>
        <section class="d7-checkout-section">
          <h2>روش دریافت</h2>
          <label><input type="radio" name="fulfillment" value="delivery" checked> ارسال</label>
          <label><input type="radio" name="fulfillment" value="pickup"> تحویل حضوری از شعبه</label>
          <div class="d7-delivery-fields" data-delivery-fields>
            <label>آدرس<input name="addressLine1" required></label>
            <label>شهر<input name="city" required></label>
            <label>استان<input name="state"></label>
            <label>کد پستی<input name="postalCode" required inputmode="numeric"></label>
          </div>
          <div class="d7-pickup-fields" data-pickup-fields hidden>
            <label>شناسه شعبه<input name="branchId" data-branch-id></label>
            <p>در مرحله اتصال واقعی، این مقدار از BranchProvider / سامانه شعب نور انتخاب خواهد شد.</p>
          </div>
        </section>
        <section class="d7-checkout-summary">
          <div><span>جمع سبد</span><strong>${formatAmount(cart.subtotal, cart.currency)}</strong></div>
          <div><span>ارسال Demo</span><strong>با توجه به روش دریافت محاسبه می‌شود</strong></div>
        </section>
        <button class="button button-primary" type="submit">ثبت سفارش و ادامه</button>
      </form>
    </main>`;
}
