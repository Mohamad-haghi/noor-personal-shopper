import type { FoundationStatus } from "../domain/foundation-status";

export function renderFoundationStatus(root: HTMLElement, status: FoundationStatus): void {
  const modeLabel = status.mode === "demo" ? "دمو" : "یکپارچه";
  const connectionLabel = status.connectedToNoorServices ? "متصل" : "متصل نیست";

  root.innerHTML = `
    <main class="foundation" id="main-content" aria-labelledby="page-title">
      <div class="foundation-intro">
        <p class="eyebrow">NOOR Personal Shopper</p>
        <h1 id="page-title">دموی مستقل نور</h1>
        <p class="summary">پوستهٔ اصلی برنامه آماده است و قابلیت‌ها در فازهای بعدی روی همین ساختار تکمیل می‌شوند.</p>
      </div>
      <div class="foundation-status" aria-label="وضعیت پایهٔ برنامه">
        <div class="status-row"><span>حالت اجرا</span><strong>${modeLabel}</strong></div>
        <div class="status-row"><span>اتصال به سامانه‌های واقعی نور</span><strong>${connectionLabel}</strong></div>
      </div>
      <div class="route-actions">
        <a class="button button-primary" href="/shopper" data-app-link>ورود به مشاور انتخاب عینک</a>
        <a class="button button-secondary" href="/products" data-app-link>مشاهده ساختار محصولات</a>
      </div>
    </main>
  `;
}
