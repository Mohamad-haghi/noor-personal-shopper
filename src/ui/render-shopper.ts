import type { ShopperFeature, ShopperStep } from "../features/shopper/shopper-feature";

function escapeHtml(value: string): string {
  return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function renderProgress(steps: readonly ShopperStep[], currentIndex: number): string {
  return steps.filter((step) => step.id !== "complete").map((step,index) => {
    const state = index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming";
    return `<li class="shopper-progress-item shopper-progress-${state}"><span aria-hidden="true">${index + 1}</span><span>${escapeHtml(step.title)}</span></li>`;
  }).join("");
}

export function renderShopper(routeView: HTMLElement, feature: ShopperFeature): void {
  const step = feature.getCurrentStep();
  const steps = feature.getSteps();
  const flow = feature.getFlowState();
  const currentIndex = steps.findIndex((item) => item.id === step.id);

  const options = step.options
    ? `<div class="shopper-options" role="group" aria-label="${escapeHtml(step.title)}">${step.options.map((option) => {
        const selected = step.field ? flow.journey[step.field] === option : false;
        return `<button class="shopper-option${selected ? " is-selected" : ""}" type="button" data-shopper-option="${escapeHtml(option)}" aria-pressed="${selected}">${escapeHtml(option)}</button>`;
      }).join("")}</div>`
    : "";

  const isComplete = step.id === "complete";
  const continueLabel = isComplete ? "مشاهده مسیر پیشنهادها" : step.id === "intro" ? "شروع مشاوره" : "ادامه";
  const summary = isComplete ? `<div class="shopper-summary">
    <div><span>نوع عینک</span><strong>${escapeHtml(flow.journey.productType ?? "—")}</strong></div>
    <div><span>کاربرد</span><strong>${escapeHtml(flow.journey.useCase ?? "—")}</strong></div>
    <div><span>استایل</span><strong>${escapeHtml(flow.journey.style ?? "—")}</strong></div>
    <div><span>فرم صورت</span><strong>${escapeHtml(flow.journey.faceShape ?? "—")}</strong></div>
  </div>
  <p class="shopper-profile-note" aria-live="polite">پروفایل انتخاب شما به‌صورت ساختاریافته در لایهٔ Profile نگه‌داری شده و برای اتصال آینده به حساب و سیستم نور آماده است.</p>` : "";

  routeView.innerHTML = `<main class="shopper" id="main-content" aria-labelledby="shopper-title">
    <div class="shopper-layout">
      <aside class="shopper-sidebar" aria-label="مراحل مشاوره">
        <p class="eyebrow">NOOR PERSONAL SHOPPER</p>
        <p class="shopper-sidebar-title">مشاور انتخاب عینک</p>
        <ol class="shopper-progress">${renderProgress(steps,currentIndex)}</ol>
      </aside>
      <section class="shopper-panel">
        <div class="shopper-header"><span class="shopper-step">مرحله ${Math.min(currentIndex + 1, steps.length - 1)} از ${steps.length - 1}</span><span class="shopper-private-note">انتخاب‌ها در پروفایل انتخاب ساختاریافتهٔ این تجربه نگه‌داری می‌شوند.</span></div>
        <div class="shopper-content">
          <p class="eyebrow">راهنمای انتخاب</p>
          <h1 id="shopper-title">${escapeHtml(step.title)}</h1>
          <p class="shopper-description">${escapeHtml(step.description)}</p>
          ${summary}${options}
        </div>
        <div class="shopper-actions">
          ${currentIndex > 0 ? '<button class="button button-secondary" type="button" data-shopper-back>بازگشت</button>' : '<a class="button button-secondary" href="/" data-app-link>خروج</a>'}
          <button class="button button-primary" type="button" data-shopper-next ${feature.canContinue() ? "" : "disabled"}>${continueLabel}</button>
        </div>
        <p class="shopper-recovery" aria-live="polite">هر زمان بخواهید می‌توانید به مرحله قبل برگردید و انتخابتان را تغییر دهید.</p>
      </section>
    </div>
  </main>`;

  routeView.querySelectorAll<HTMLButtonElement>("[data-shopper-option]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!step.field) return;
      button.disabled = true;
      try {
        await feature.setAnswer(step.field, button.dataset.shopperOption ?? "");
      } finally {
        renderShopper(routeView, feature);
      }
    });
  });

  routeView.querySelector<HTMLButtonElement>("[data-shopper-back]")?.addEventListener("click", () => {
    feature.back();
    renderShopper(routeView, feature);
  });

  routeView.querySelector<HTMLButtonElement>("[data-shopper-next]")?.addEventListener("click", () => {
    if (!feature.canContinue()) return;
    if (step.id === "complete") {
      window.history.pushState(null, "", "/recommendations");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    feature.next();
    renderShopper(routeView, feature);
  });
}
