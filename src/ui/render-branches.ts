import type { Branch } from "../domain";

export function renderBranches(root: HTMLElement, branches: readonly Branch[]): void {
  root.innerHTML = `
    <main class="d8-page" id="main-content" aria-labelledby="branches-title">
      <section class="d8-intro">
        <p class="eyebrow">DEMO BRANCHES</p>
        <h1 id="branches-title">شعبه‌ای را برای مراجعه انتخاب کنید.</h1>
        <p>اطلاعات این فهرست نمایشی است و برای اجرای مسیر Personal Shopper در Demo استفاده می‌شود.</p>
      </section>
      <section class="d8-branch-grid" aria-label="شعبه‌های نمایشی">
        ${branches.map((branch) => `
          <article class="d8-branch-card">
            <p class="eyebrow">${branch.code}</p>
            <h2>${branch.name}</h2>
            <p>${branch.location.city} — ${branch.location.region}</p>
            <p>${branch.location.address}</p>
            <p class="d8-muted">خدمات: ${branch.services.map((service) => ({
              fitting: "فیتینگ", consultation: "مشاوره", pickup: "تحویل سفارش", returns: "مرجوعی", alterations: "اصلاحات"
            } as Record<string, string>)[service] ?? service).join("، ")}</p>
            <div class="d8-actions">
              <a class="button button-primary" href="/visit?branch=${encodeURIComponent(branch.identity.id)}" data-app-link>انتخاب این شعبه</a>
            </div>
          </article>
        `).join("")}
      </section>
    </main>
  `;
}
