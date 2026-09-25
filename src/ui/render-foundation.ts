import type { FoundationStatus } from "../domain/foundation-status";

export function renderFoundationStatus(
  root: HTMLElement,
  status: FoundationStatus,
): void {
  const modeLabel = status.mode === "demo" ? "دمو" : "یکپارچه";
  const connectionLabel = status.connectedToNoorServices
    ? "متصل"
    : "متصل نیست";

  root.innerHTML = `
    <main class="foundation" aria-labelledby="page-title">
      <p class="eyebrow">دموی مستقل</p>
      <h1 id="page-title">نور</h1>
      <p class="summary">پایهٔ برنامه آماده است.</p>
      <dl class="status-list">
        <div class="status-row">
          <dt>حالت اجرا</dt>
          <dd>${modeLabel}</dd>
        </div>
        <div class="status-row">
          <dt>اتصال به سامانه‌های واقعی نور</dt>
          <dd>${connectionLabel}</dd>
        </div>
      </dl>
    </main>
  `;
}
