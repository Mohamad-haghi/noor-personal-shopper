import type { Branch, Visit } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function formatSlot(value: Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function createDemoVisitSlots(now = new Date()): readonly Date[] {
  const slots: Date[] = [];
  for (let day = 1; day <= 5; day += 1) {
    for (const hour of [11, 14, 17]) {
      const slot = new Date(now);
      slot.setHours(0, 0, 0, 0);
      slot.setDate(slot.getDate() + day);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot);
    }
  }
  return slots;
}

export function renderVisit(
  root: HTMLElement,
  branches: readonly Branch[],
  accountEmail: string | null,
  selectedBranchId: string | null,
  existingVisit: Visit | null,
  errorMessage: string | null = null,
): void {
  const branch = branches.find((item) => item.identity.id === selectedBranchId) ?? null;
  if (existingVisit && branch) {
    root.innerHTML = `
      <main class="d8-page lab-visit-page" id="main-content" aria-labelledby="visit-confirmation-title">
        <header class="lab-visit-head">
          <p class="eyebrow" dir="ltr">VISIT REQUEST CONFIRMED</p>
          <h1 id="visit-confirmation-title">درخواست مراجعه ثبت شد.</h1>
          <p>درخواست شما در وضعیت نمایشی ثبت شده و در اجرای واقعی می‌تواند به سیستم شعب و زمان‌بندی NOOR متصل شود.</p>
        </header>
        <section class="d8-confirmation lab-visit-confirmation" aria-label="جزئیات درخواست مراجعه">
          <div><span>شناسه درخواست</span><strong>${escapeHtml(existingVisit.identity.id)}</strong></div>
          <div><span>شعبه</span><strong>${escapeHtml(branch.name)}</strong></div>
          <div><span>زمان مراجعه</span><strong>${escapeHtml(formatSlot(existingVisit.scheduledAt))}</strong></div>
          <div><span>وضعیت</span><strong>درخواست ثبت شد</strong></div>
        </section>
        <nav class="lab-visit-actions" aria-label="گام بعدی">
          <a class="button button-primary" href="/shopper" data-app-link>ادامه در Personal Shopper</a>
          <a class="button button-secondary" href="/branches" data-app-link>انتخاب شعبه دیگر</a>
        </nav>
      </main>
    `;
    return;
  }

  const slots = createDemoVisitSlots();
  root.innerHTML = `
    <main class="d8-page lab-visit-page" id="main-content" aria-labelledby="visit-title">
      <header class="lab-visit-head">
        <p class="eyebrow" dir="ltr">IN-PERSON VISIT</p>
        <h1 id="visit-title">زمان مراجعه را انتخاب کنید.</h1>
        <p>برای اجرای Demo، یک شعبه و زمان پیشنهادی انتخاب کنید. درخواست به حساب مستقل Personal Shopper متصل می‌شود.</p>
      </header>
      <p class="lab-visit-note" role="note">زمان‌های نمایش‌داده‌شده نمونه هستند و به سامانه رزرو واقعی شعب نور متصل نیستند.</p>
      ${accountEmail ? "" : '<p class="d8-form-error lab-visit-error" role="alert">برای ثبت درخواست، ابتدا وارد حساب مستقل Personal Shopper شوید.</p><a class="button button-secondary lab-visit-account-link" href="/account" data-app-link>ورود یا ساخت حساب</a>'}
      ${errorMessage ? `<p class="d8-form-error lab-visit-error" role="alert">${escapeHtml(errorMessage)}</p>` : ""}
      <form class="d8-form lab-visit-form" data-visit-form>
        <section class="lab-visit-form-section">
          <p class="eyebrow">01 · انتخاب شعبه و زمان</p>
          <label for="visit-branch">شعبه</label>
          <select id="visit-branch" name="branchId" required>
            <option value="">انتخاب شعبه</option>
            ${branches.map((item) => `<option value="${escapeHtml(item.identity.id)}" ${item.identity.id === selectedBranchId ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
          <label for="visit-time">زمان مراجعه</label>
          <select id="visit-time" name="scheduledAt" required>
            <option value="">انتخاب زمان</option>
            ${slots.map((slot) => `<option value="${slot.toISOString()}">${escapeHtml(formatSlot(slot))}</option>`).join("")}
          </select>
        </section>
        <section class="lab-visit-form-section">
          <p class="eyebrow">02 · هدف مراجعه</p>
          <label for="visit-purpose">هدف مراجعه</label>
          <select id="visit-purpose" name="purpose">
            <option value="consultation">مشاوره</option>
            <option value="fitting">فیتینگ</option>
          </select>
          <label for="visit-notes">یادداشت</label>
          <textarea id="visit-notes" name="notes" rows="4" maxlength="500" placeholder="اختیاری"></textarea>
        </section>
        <button class="button button-primary lab-visit-submit" type="submit" ${accountEmail ? "" : "disabled"}>ثبت درخواست مراجعه</button>
      </form>
    </main>
  `;
}
