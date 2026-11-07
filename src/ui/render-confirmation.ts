import type { Confirmation, Order } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " " + (currency === "IRR" ? "ریال" : currency);
}

export function renderConfirmation(routeView: HTMLElement, confirmation: Confirmation | null, order: Order | null): void {
  if (!confirmation || !order) {
    routeView.innerHTML = `
      <main class="lab-confirmation-page" id="main-content" aria-labelledby="confirmation-title">
        <header class="lab-confirmation-head">
          <p class="eyebrow" dir="ltr">ORDER CONFIRMATION</p>
          <h1 id="confirmation-title">تأیید سفارش پیدا نشد</h1>
          <p>برای نمایش تأییدیه، ابتدا یک خرید موفق در همین Demo انجام دهید.</p>
        </header>
        <section class="lab-confirmation-empty" role="status">
          <p>هنوز تأییدیه‌ای برای این جلسه پیدا نشده است.</p>
          <a class="button button-primary" href="/recommendations" data-app-link>بازگشت به پیشنهادها</a>
        </section>
      </main>
    `;
    return;
  }

  routeView.innerHTML = `
    <main class="lab-confirmation-page" id="main-content" aria-labelledby="confirmation-title">
      <header class="lab-confirmation-head">
        <p class="eyebrow" dir="ltr">ORDER CONFIRMED</p>
        <h1 id="confirmation-title">سفارش شما با موفقیت تأیید شد</h1>
        <p>پرداخت Demo موفق بوده و سفارش در وضعیت تأییدشدهٔ Demo ذخیره شده است.</p>
      </header>
      <section class="lab-confirmation-card" aria-label="جزئیات تأیید سفارش">
        <div><span>شناسه سفارش</span><strong>${escapeHtml(order.identity.id)}</strong></div>
        <div><span>شناسه درخواست</span><strong>${escapeHtml(confirmation.requestIdentity.requestToken)}</strong></div>
        <div><span>وضعیت سفارش</span><strong>تأیید شده در Demo</strong></div>
        <div><span>مبلغ نهایی Demo</span><strong>${formatAmount(order.pricing.total, order.pricing.currency)}</strong></div>
      </section>
      <p class="lab-confirmation-note" role="note">این سفارش و شناسه‌ها مربوط به Demo هستند. در اتصال واقعی، شناسه سفارش و درخواست از سامانه فروش نور دریافت خواهند شد.</p>
      <nav class="lab-confirmation-actions" aria-label="گام بعدی">
        <a class="button button-primary" href="/choices" data-app-link>بازگشت به انتخاب‌های من</a>
        <a class="button button-secondary" href="/recommendations" data-app-link>دیدن پیشنهادهای بیشتر</a>
      </nav>
    </main>
  `;
}
