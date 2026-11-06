import type { ShopperFeature } from "../features/shopper/shopper-feature";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

const MANDATORY_LABELS: Record<string, string> = {
  frameShape: "فرم فریم",
  frameMaterial: "جنس فریم",
  frameColor: "رنگ فریم",
};

export function renderSelectionProfile(routeView: HTMLElement, feature: ShopperFeature): void {
  const journey = feature.getFlowState().journey;
  const rows = [
    { label: "نوع عینک", value: journey.productType, step: 1 },
    { label: "موقعیت استفاده", value: journey.useCase, step: 2 },
    { label: "فرم فریم ترجیحی", value: journey.style, step: 3 },
    { label: "فرم صورت", value: journey.faceShape, step: 4 },
    { label: "جنس فریم", value: journey.frameMaterial, step: 5 },
    { label: "رنگ فریم", value: journey.frameColor, step: 6 },
    { label: "گروه محصول", value: journey.gender, step: 7 },
  ];
  const hasProfile = rows.some((row) => Boolean(row.value));
  if (!hasProfile) {
    routeView.innerHTML = `<main class="lab-profile-page" id="main-content">
      <header class="lab-page-head"><p class="eyebrow" dir="ltr">SELECTION PROFILE</p><h1>هنوز پروفایلی ساخته نشده</h1>
      <p>برای ساخت پروفایل انتخاب، مشاورهٔ نور را آغاز کنید.</p></header>
      <a class="button button-primary" href="/shopper" data-app-link>شروع مشاوره</a>
    </main>`;
    return;
  }

  const mandatory = (journey.mandatoryCriteria ?? []).map((key) => MANDATORY_LABELS[key] ?? key);
  const rowMarkup = rows.map((row) => `<li class="lab-profile-row">
    <div><span class="lab-profile-label">${escapeHtml(row.label)}</span>
    <strong>${escapeHtml(row.value ?? "ثبت نشده")}</strong></div>
    <a class="lab-edit-link" href="/shopper?step=${row.step}" data-app-link>ویرایش</a>
  </li>`).join("");
  routeView.innerHTML = `<main class="lab-profile-page" id="main-content" aria-labelledby="selection-profile-title">
    <header class="lab-page-head"><p class="eyebrow" dir="ltr">SELECTION PROFILE</p>
      <h1 id="selection-profile-title">پروفایل انتخاب شما</h1>
      <p>خلاصهٔ ترجیحاتتان را مرور کنید. هر مورد را می‌توانید تغییر دهید؛ این اطلاعات از پروفایل ساختاریافتهٔ NOOR خوانده می‌شود.</p>
    </header>
    <section class="lab-profile-panel" aria-label="خلاصهٔ انتخاب‌ها">
      <ul class="lab-profile-list">${rowMarkup}</ul>
      <div class="lab-profile-row lab-profile-mandatory">
        <div><span class="lab-profile-label">معیارهای اجباری</span>
          <strong>${mandatory.length ? escapeHtml(mandatory.join("، ")) : "هیچ‌کدام"}</strong>
          <small>فقط معیارهایی که در مسیر مشاوره به‌عنوان اجباری مشخص کرده‌اید.</small>
        </div>
        <div class="lab-mandatory-edit-links" aria-label="ویرایش معیارهای اجباری">
          <a class="lab-edit-link" href="/shopper?step=3" data-app-link>فرم</a>
          <a class="lab-edit-link" href="/shopper?step=5" data-app-link>جنس</a>
          <a class="lab-edit-link" href="/shopper?step=6" data-app-link>رنگ</a>
        </div>
      </div>
    </section>
    <p class="lab-profile-note" role="note">این صفحه فقط خلاصهٔ انتخاب‌هاست. با ادامه، پیشنهادها از مسیر اصلی NOOR و موتور تصمیم COR درخواست می‌شوند؛ نتیجهٔ محلی آزمایشگاه در این مسیر استفاده نمی‌شود.</p>
    <div class="lab-profile-actions">
      <a class="button button-primary" href="/recommendations" data-app-link>مشاهده پیشنهادها</a>
      <a class="button button-secondary" href="/shopper?step=1" data-app-link>ویرایش پروفایل</a>
    </div>
  </main>`;
}
