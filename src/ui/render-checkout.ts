import type { Account, Cart, Order, Payment } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
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
    routeView.innerHTML = `
      <main class="d7-checkout-page lab-checkout-page" id="main-content" aria-labelledby="checkout-title">
        <header class="lab-checkout-head">
          <p class="eyebrow" dir="ltr">DEMO ORDER CREATED</p>
          <h1 id="checkout-title">سفارش آمادهٔ پرداخت است</h1>
          <p>سفارش در Demo ایجاد شد. پرداخت واقعی در مرحلهٔ بعد به‌صورت Mock Payment نمایش داده می‌شود.</p>
        </header>
        <section class="d7-checkout-summary lab-checkout-summary" aria-label="خلاصه سفارش">
          <div><span>شناسه سفارش</span><strong>${escapeHtml(order.identity.id)}</strong></div>
          <div><span>جمع کالاها</span><strong>${formatAmount(order.pricing.subtotal, order.pricing.currency)}</strong></div>
          <div><span>هزینه ارسال</span><strong>${formatAmount(order.pricing.shipping, order.pricing.currency)}</strong></div>
          <div><span>مبلغ نهایی Demo</span><strong>${formatAmount(order.pricing.total, order.pricing.currency)}</strong></div>
        </section>
        <p class="lab-checkout-note d7-demo-note" role="note">این مبلغ و اطلاعات خرید نمایشی هستند و به قیمت واقعی یا درگاه بانکی فروشگاه نور متصل نیستند.</p>
      </main>
    `;
    return;
  }

  if (!cart || cart.items.length === 0) {
    routeView.innerHTML = `
      <main class="d7-checkout-page lab-checkout-page" id="main-content" aria-labelledby="checkout-title">
        <header class="lab-checkout-head">
          <p class="eyebrow" dir="ltr">DEMO CHECKOUT</p>
          <h1 id="checkout-title">تکمیل سفارش</h1>
          <p>برای ادامه ابتدا یک فریم را به سبد خرید نمایشی اضافه کنید.</p>
        </header>
        <section class="lab-checkout-empty" role="status">
          <h2>سبد خرید شما خالی است.</h2>
          <p>ابتدا پیشنهادهای خود را مرور کنید یا از مجموعه یک فریم انتخاب کنید.</p>
          <div class="lab-checkout-empty-actions">
            <a class="button button-primary" href="/recommendations" data-app-link>دیدن پیشنهادها</a>
            <a class="button button-secondary" href="/products" data-app-link>مشاهده مجموعه</a>
          </div>
        </section>
      </main>
    `;
    return;
  }

  if (!account) {
    routeView.innerHTML = `
      <main class="d7-checkout-page lab-checkout-page" id="main-content" aria-labelledby="checkout-title">
        <header class="lab-checkout-head">
          <p class="eyebrow" dir="ltr">DEMO CHECKOUT</p>
          <h1 id="checkout-title">ورود به حساب کاربری</h1>
          <p>برای ثبت سفارش نمایشی، ابتدا با حساب مستقل Personal Shopper وارد شوید.</p>
        </header>
        <section class="lab-checkout-empty">
          <p>حساب Personal Shopper از حساب سایت اصلی نور مستقل است.</p>
          <a class="button button-primary" href="/account" data-app-link>ورود / ثبت‌نام</a>
        </section>
      </main>
    `;
    return;
  }

  routeView.innerHTML = `
    <main class="d7-checkout-page lab-checkout-page" id="main-content" aria-labelledby="checkout-title">
      <header class="lab-checkout-head">
        <p class="eyebrow" dir="ltr">DEMO CHECKOUT</p>
        <h1 id="checkout-title">تکمیل سفارش</h1>
        <p>اطلاعات دریافت را برای ادامه مسیر نمایشی وارد کنید. هیچ سفارش واقعی یا پرداخت بانکی در این مرحله انجام نمی‌شود.</p>
      </header>
      <p class="lab-checkout-note" role="note">مبلغ‌ها «قیمت نمایشی Demo» هستند. قیمت و موجودی واقعی فروشگاه نور در این نسخه متصل نیستند.</p>
      ${errorMessage ? `<p class="d7-form-error lab-checkout-error" role="alert">${escapeHtml(errorMessage)}</p>` : ""}
      <form class="d7-checkout-form lab-checkout-form" data-checkout-form>
        <section class="d7-checkout-section lab-checkout-section">
          <p class="eyebrow">01 · خریدار</p>
          <h2>اطلاعات خریدار</h2>
          <label for="checkout-recipient-name">نام گیرنده</label>
          <input id="checkout-recipient-name" name="recipientName" required value="${escapeHtml([account.profile.firstName, account.profile.lastName].filter(Boolean).join(" "))}">
          <label for="checkout-phone">شماره تماس</label>
          <input id="checkout-phone" name="phone" value="${escapeHtml(account.phone ?? "")}" inputmode="tel" autocomplete="tel">
        </section>
        <section class="d7-checkout-section lab-checkout-section">
          <p class="eyebrow">02 · دریافت</p>
          <h2>روش دریافت</h2>
          <div class="lab-checkout-fulfillment-options">
            <label class="lab-checkout-radio"><input type="radio" name="fulfillment" value="delivery" checked><span>ارسال</span></label>
            <label class="lab-checkout-radio"><input type="radio" name="fulfillment" value="pickup"><span>تحویل حضوری از شعبه</span></label>
          </div>
          <div class="d7-delivery-fields lab-checkout-delivery-fields" data-delivery-fields>
            <label for="checkout-address">آدرس</label>
            <input id="checkout-address" name="addressLine1" required autocomplete="street-address">
            <label for="checkout-city">شهر</label>
            <input id="checkout-city" name="city" required autocomplete="address-level2">
            <label for="checkout-state">استان</label>
            <input id="checkout-state" name="state" autocomplete="address-level1">
            <label for="checkout-postal-code">کد پستی</label>
            <input id="checkout-postal-code" name="postalCode" required inputmode="numeric" autocomplete="postal-code">
          </div>
          <div class="d7-pickup-fields lab-checkout-pickup-fields" data-pickup-fields hidden>
            <label for="checkout-branch-id">شناسه شعبه</label>
            <input id="checkout-branch-id" name="branchId" data-branch-id>
            <p>در مرحله اتصال واقعی، شعبه از سامانه شعب نور انتخاب خواهد شد. در این Demo شناسه معتبر شعبه لازم است.</p>
          </div>
        </section>
        <section class="d7-checkout-summary lab-checkout-summary">
          <p class="eyebrow">03 · خلاصه</p>
          <h2>خلاصه سفارش</h2>
          <div><span>جمع سبد</span><strong>${formatAmount(cart.subtotal, cart.currency)}</strong></div>
          <div><span>ارسال Demo</span><strong>با توجه به روش دریافت محاسبه می‌شود</strong></div>
          <p class="lab-checkout-summary-note">هزینه‌ها و مبلغ نهایی فقط در نسخه نمایشی محاسبه می‌شوند.</p>
        </section>
        <button class="button button-primary lab-checkout-submit" type="submit">ثبت سفارش و ادامه</button>
      </form>
    </main>
  `;
}



export function renderPaymentState(
  routeView: HTMLElement,
  order: Order,
  payment: Payment | null,
  onPay: (simulateFailure: boolean) => Promise<void>,
): void {
  if (!payment) {
    routeView.innerHTML = `
      <main class="d7-checkout-page" id="main-content">
        <section class="d7-checkout-intro">
          <p class="eyebrow">DEMO PAYMENT</p>
          <h1>پرداخت سفارش</h1>
          <p>این پرداخت کاملاً آزمایشی است. هیچ وجه واقعی جابه‌جا نمی‌شود و درگاه واقعی NOOR در این مرحله متصل نیست.</p>
        </section>
        <section class="d7-checkout-summary">
          <div><span>شناسه سفارش</span><strong>${escapeHtml(order.identity.id)}</strong></div>
          <div><span>مبلغ قابل پرداخت</span><strong>${formatAmount(order.pricing.total, order.pricing.currency)}</strong></div>
        </section>
        <label class="d7-demo-toggle"><input type="checkbox" data-simulate-failure> شبیه‌سازی پرداخت ناموفق برای تست Recovery</label>
        <button class="button button-primary" type="button" data-demo-pay>پرداخت Demo</button>
      </main>`;
    routeView.querySelector<HTMLButtonElement>("[data-demo-pay]")?.addEventListener("click", async () => {
      const simulateFailure = routeView.querySelector<HTMLInputElement>("[data-simulate-failure]")?.checked ?? false;
      await onPay(simulateFailure);
    });
    return;
  }

  const success = payment.status === "captured" || payment.status === "authorized";
  const orderPersisted = success && order.status === "confirmed";
  routeView.innerHTML = `
    <main class="d7-checkout-page" id="main-content">
      <section class="d7-checkout-intro">
        <p class="eyebrow">${success ? "PAYMENT SUCCESS" : "PAYMENT FAILED"}</p>
        <h1>${success ? "پرداخت Demo موفق بود" : "پرداخت انجام نشد"}</h1>
        <p>${success
          ? "تراکنش آزمایشی با موفقیت ثبت شد. سفارش در وضعیت نهایی Demo ذخیره شده و مرحلهٔ بعدی نمایش Confirmation و شناسهٔ سفارش است."
          : "تراکنش آزمایشی ناموفق بود. می‌توانید دوباره تلاش کنید یا به Checkout برگردید."}</p>
      </section>
      <section class="d7-checkout-summary">
        <div><span>شناسه سفارش</span><strong>${escapeHtml(order.identity.id)}</strong></div>
        <div><span>وضعیت پرداخت</span><strong>${success ? "موفق" : "ناموفق"}</strong></div>
        <div><span>وضعیت سفارش</span><strong>${orderPersisted ? "تأیید و ذخیره‌شده در Demo" : "پیش‌نویس Checkout"}</strong></div>
        <div><span>مبلغ</span><strong>${formatAmount(payment.amount, payment.currency)}</strong></div>
        <div><span>شناسه تراکنش Demo</span><strong>${escapeHtml(payment.transaction?.providerTransactionId ?? "—")}</strong></div>
      </section>
      <p class="d7-demo-note">پرداخت و شناسه تراکنش نمایشی هستند و به هیچ درگاه بانکی واقعی متصل نیستند.</p>
      ${success ? "" : '<button class="button button-primary" type="button" data-demo-retry>تلاش دوباره</button>'}
    </main>`;
  routeView.querySelector<HTMLButtonElement>("[data-demo-retry]")?.addEventListener("click", async () => {
    await onPay(false);
  });
}
