import type { Branch } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

const SERVICE_LABELS: Record<string, string> = {
  fitting: "فیتینگ",
  consultation: "مشاوره",
  pickup: "تحویل سفارش",
  returns: "مرجوعی",
  alterations: "اصلاحات",
};

export function renderBranches(root: HTMLElement, branches: readonly Branch[]): void {
  const cards = branches.map((branch, index) => {
    const services = branch.services.map((service) => SERVICE_LABELS[service] ?? service);
    const href = `/visit?branch=${encodeURIComponent(branch.identity.id)}`;
    return `
      <article class="lab-branch-card">
        <div class="lab-branch-card-top">
          <p class="eyebrow">${escapeHtml(branch.code)}</p>
          <span class="lab-branch-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
        </div>
        <h2>${escapeHtml(branch.name)}</h2>
        <p class="lab-branch-region">${escapeHtml(branch.location.city)} — ${escapeHtml(branch.location.region)}</p>
        <p class="lab-branch-address">${escapeHtml(branch.location.address)}</p>
        <div class="lab-branch-services" aria-label="خدمات شعبه">
          ${services.map((service) => `<span>${escapeHtml(service)}</span>`).join("")}
        </div>
        <a class="button button-primary" href="${href}" data-app-link>انتخاب این شعبه</a>
      </article>
    `;
  }).join("");

  root.innerHTML = `
    <main class="lab-branches-page" id="main-content" aria-labelledby="branches-title">
      <header class="lab-branches-head">
        <p class="eyebrow" dir="ltr">NOOR DEMO BRANCHES</p>
        <h1 id="branches-title">شعبه‌ای را برای مراجعه انتخاب کنید.</h1>
        <p>اطلاعات این فهرست نمایشی است و برای اجرای مسیر Personal Shopper در Demo استفاده می‌شود.</p>
      </header>
      <p class="lab-branches-note" role="note">این فهرست شعب نمایشی است؛ انتخاب شعبه فقط برای ادامه مسیر درخواست بازدید در Demo استفاده می‌شود.</p>
      ${branches.length
        ? `<section class="lab-branch-grid" aria-label="شعبه‌های نمایشی">${cards}</section>`
        : `<section class="lab-branches-empty" role="status"><h2>در حال حاضر شعبه‌ای برای نمایش ثبت نشده است.</h2><p>بعداً دوباره مراجعه کنید یا مسیر مشاوره آنلاین را ادامه دهید.</p><a class="button button-primary" href="/shopper" data-app-link>ادامه مشاوره آنلاین</a></section>`}
    </main>
  `;
}
