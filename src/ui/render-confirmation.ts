import type { Confirmation, Order } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " " + (currency === "IRR" ? "ریال" : currency);
}

export function renderConfirmation(routeView: HTMLElement, confirmation: Confirmation | null, order: Order | null): void {
  if (!confirmation || !order) {
    routeView.innerHTML = `
      <main class="d7-confirmation-page" id="main-content">
        <section class="d7-confirmation-intro">
          <p class="eyebrow">CONFIRMATION</p>
          <h1>تأیید سفارش پیدا نشد</h1>
          <p>برای نمایش تأییدیه، ابتدا یک خرید موفق در همین Demo انجام دهید.</p>
          <a class="button button-primary" href="/recommendations" data-app-link>بازگشت به پیشنهادها</a>
        </section>
      </main>`;
    return;
  }

  routeView.innerHTML = `
    <main class="d7-confirmation-page" id="main-content" aria-labelledby="confirmation-title">
      <section class="d7-confirmation-intro">
        <p class="eyebrow">ORDER CONFIRMED</p>
        <h1 id="confirmation-title">سفارش شما با موفقیت تأیید شد</h1>
        <p>پرداخت Demo موفق بوده و سفارش در وضعیت تأییدشدهٔ Demo ذخیره شده است.</p>
      </section>
      <section class="d7-confirmation-card">
        <div><span>شناسه سفارش</span><strong>${escapeHtml(order.identity.id)}</strong></div>
        <div><span>شناسه درخواست</span><strong>${escapeHtml(confirmation.requestIdentity.requestToken)}</strong></div>
        <div><span>وضعیت سفارش</span><strong>تأیید شده</strong></div>
        <div><span>مبلغ نهایی Demo</span><strong>${formatAmount(order.pricing.total, order.pricing.currency)}</strong></div>
      </section>
      <p class="d7-demo-note">این سفارش و شناسه‌ها مربوط به Demo هستند. در اتصال واقعی، همین مسیر می‌تواند شناسه واقعی سفارش/درخواست را از سامانه فروش نور نمایش دهد.</p>
      <nav class="d7-confirmation-actions" aria-label="گام بعدی">
        <a class="button button-primary" href="/choices" data-app-link>بازگشت به انتخاب‌های من</a>
        <a class="button button-secondary" href="/recommendations" data-app-link>دیدن پیشنهادهای بیشتر</a>
      </nav>
    </main>`;
}
