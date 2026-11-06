import type { ShopperFeature, ShopperStep } from "../features/shopper/shopper-feature";
import { withBasePath } from "../app/routing/create-router";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function renderProgress(steps: readonly ShopperStep[], currentIndex: number): string {
  const questions = steps.filter((step) => step.id !== "intro" && step.id !== "complete");
  const activeQuestion = currentIndex <= 0 ? -1 : Math.min(currentIndex - 1, questions.length - 1);
  return questions.map((_, index) =>
    `<span class="lab-shopper-progress-segment${index <= activeQuestion ? " is-active" : ""}"></span>`
  ).join("");
}

export function renderShopper(routeView: HTMLElement, feature: ShopperFeature): void {
  const step = feature.getCurrentStep();
  const steps = feature.getSteps();
  const flow = feature.getFlowState();
  const currentIndex = steps.findIndex((item) => item.id === step.id);
  const questionSteps = steps.filter((item) => item.id !== "intro" && item.id !== "complete");
  const questionIndex = currentIndex <= 0 ? 0 : Math.min(currentIndex, questionSteps.length);
  const isIntro = step.id === "intro";
  const isComplete = step.id === "complete";

  const options = step.options
    ? `<div class="shopper-options lab-shopper-options" role="group" aria-label="${escapeHtml(step.title)}">${step.options.map((option) => {
        const selected = step.field ? flow.journey[step.field] === option : false;
        return `<button class="shopper-option${selected ? " is-selected" : ""}" type="button" data-shopper-option="${escapeHtml(option)}" aria-pressed="${selected}"><span>${escapeHtml(option)}</span>${selected ? '<span class="lab-shopper-check" aria-hidden="true">✓</span>' : ""}</button>`;
      }).join("")}</div>`
    : "";

  const mandatoryByStep: Partial<Record<ShopperStep["id"], "frameShape" | "frameMaterial" | "frameColor">> = {
    style: "frameShape",
    "frame-material": "frameMaterial",
    "frame-color": "frameColor",
  };
  const mandatoryCriterion = mandatoryByStep[step.id];
  const selectedValue = step.field ? flow.journey[step.field] : null;
  const canMarkMandatory = Boolean(mandatoryCriterion && selectedValue &&
    selectedValue !== "فرقی ندارد" && selectedValue !== "مطمئن نیستم");
  const mandatoryControl = canMarkMandatory && mandatoryCriterion
    ? `<label class="shopper-mandatory-control lab-shopper-mandatory"><input type="checkbox" data-shopper-mandatory="${mandatoryCriterion}" ${(flow.journey.mandatoryCriteria ?? []).includes(mandatoryCriterion) ? "checked" : ""}><span><strong>این معیار برای من اجباری است</strong><small>اگر هیچ محصولی با این شرط پیدا نشود، COR پیشنهاد منطبق نمایش نمی‌دهد.</small></span></label>`
    : "";

  const summary = isComplete ? `<div class="shopper-summary lab-shopper-summary">
    <div><span>نوع عینک</span><strong>${escapeHtml(flow.journey.productType ?? "—")}</strong></div>
    <div><span>کاربرد</span><strong>${escapeHtml(flow.journey.useCase ?? "—")}</strong></div>
    <div><span>فرم فریم ترجیحی</span><strong>${escapeHtml(flow.journey.style ?? "—")}</strong></div>
    <div><span>فرم صورت</span><strong>${escapeHtml(flow.journey.faceShape ?? "—")}</strong></div>
    <div><span>جنس فریم</span><strong>${escapeHtml(flow.journey.frameMaterial ?? "فرقی ندارد")}</strong></div>
    <div><span>رنگ فریم</span><strong>${escapeHtml(flow.journey.frameColor ?? "فرقی ندارد")}</strong></div>
    <div><span>گروه محصول</span><strong>${escapeHtml(flow.journey.gender ?? "فرقی ندارد")}</strong></div>
    <div><span>شرط‌های اجباری</span><strong>${(flow.journey.mandatoryCriteria ?? []).length ? escapeHtml((flow.journey.mandatoryCriteria ?? []).join("، ")) : "هیچ‌کدام"}</strong></div>
  </div>
  <p class="shopper-profile-note" aria-live="polite">پروفایل انتخاب شما در لایهٔ ساختاریافتهٔ NOOR نگه‌داری می‌شود و برای مرحلهٔ پیشنهادها آماده است.</p>` : "";

  const progressLabel = isIntro
    ? "آمادهٔ شروع"
    : isComplete
      ? `${questionSteps.length.toLocaleString("fa-IR")} پرسش تکمیل شد`
      : `پرسش ${questionIndex.toLocaleString("fa-IR")} از ${questionSteps.length.toLocaleString("fa-IR")}`;
  const continueLabel = isComplete ? "مشاهده پروفایل انتخاب" : isIntro ? "شروع مشاوره" : "ادامه";

  routeView.innerHTML = `<main class="shopper lab-shopper" id="main-content" aria-labelledby="shopper-title">
    <div class="shopper-layout lab-shopper-layout">
      <div class="lab-shopper-top">
        <span class="eyebrow" dir="ltr">PERSONAL SHOPPER</span>
        <span class="lab-shopper-count" aria-live="polite">${progressLabel}</span>
      </div>
      <div class="lab-shopper-progress" role="progressbar" aria-label="پیشرفت مشاوره" aria-valuemin="0" aria-valuemax="${questionSteps.length}" aria-valuenow="${isIntro ? 0 : isComplete ? questionSteps.length : questionIndex}">
        ${renderProgress(steps, currentIndex)}
      </div>
      <section class="shopper-panel lab-shopper-panel">
        <div class="shopper-content lab-shopper-content">
          <div class="lab-shopper-title-row"><span dir="ltr">NOOR</span><h1 id="shopper-title">${escapeHtml(step.title)}</h1></div>
          <p class="shopper-description">${escapeHtml(step.description)}</p>
          ${isIntro ? '<p class="lab-shopper-intro-note">پاسخ‌ها در طول همین جلسه قابل ویرایش هستند.</p>' : ""}
          ${summary}
          ${options}
          ${mandatoryControl}
        </div>
        <div class="shopper-actions lab-shopper-actions">
          ${currentIndex > 0 ? '<button class="button button-secondary" type="button" data-shopper-back>قبلی</button>' : '<a class="button button-secondary" href="/" data-app-link>خروج</a>'}
          <button class="button button-primary" type="button" data-shopper-next ${feature.canContinue() ? "" : "disabled"}>${continueLabel}</button>
        </div>
        <p class="shopper-recovery lab-shopper-recovery" aria-live="polite">هر زمان بخواهید می‌توانید به مرحلهٔ قبل برگردید و انتخابتان را تغییر دهید.</p>
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

  routeView.querySelector<HTMLInputElement>("[data-shopper-mandatory]")?.addEventListener("change", async (event) => {
    const checkbox = event.currentTarget as HTMLInputElement;
    const criterion = checkbox.dataset.shopperMandatory as "frameShape" | "frameMaterial" | "frameColor" | undefined;
    if (!criterion) return;
    checkbox.disabled = true;
    try {
      await feature.setCriterionMandatory(criterion, checkbox.checked);
    } finally {
      renderShopper(routeView, feature);
    }
  });

  routeView.querySelector<HTMLButtonElement>("[data-shopper-back]")?.addEventListener("click", () => {
    feature.back();
    renderShopper(routeView, feature);
  });

  routeView.querySelector<HTMLButtonElement>("[data-shopper-next]")?.addEventListener("click", () => {
    if (!feature.canContinue()) return;
    if (isComplete) {
      window.history.pushState(null, "", withBasePath("/profile", import.meta.env.BASE_URL));
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    feature.next();
    renderShopper(routeView, feature);
  });
}
