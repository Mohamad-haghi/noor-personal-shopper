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
      <main class="d8-page" id="main-content" aria-labelledby="visit-confirmation-title">
        <section class="d8-intro">
          <p class="eyebrow">VISIT REQUEST</p>
          <h1 id="visit-confirmation-title">درخواست مراجعه ثبت شد.</h1>
          <p>این درخواست در وضعیت نمایشی ثبت شده و در اجرای واقعی می‌تواند به سیستم شعب و زمان‌بندی NOOR متصل شود.</p>
        </section>
        <section class="d8-confirmation">
          <div><span>Request ID</span><strong>${escapeHtml(existingVisit.identity.id)}</strong></div>
          <div><span>شعبه</span><strong>${escapeHtml(branch.name)}</strong></div>
          <div><span>زمان مراجعه</span><strong>${escapeHtml(formatSlot(existingVisit.scheduledAt))}</strong></div>
          <div><span>وضعیت</span><strong>درخواست ثبت شد</strong></div>
        </section>
        <div class="route-actions">
          <a class="button button-primary" href="/shopper" data-app-link>ادامه در Personal Shopper</a>
          <a class="button button-secondary" href="/branches" data-app-link>انتخاب شعبه دیگر</a>
        </div>
      </main>
    `;
    return;
  }

  const slots = createDemoVisitSlots();
  root.innerHTML = `
    <main class="d8-page" id="main-content" aria-labelledby="visit-title">
      <section class="d8-intro">
        <p class="eyebrow">IN-PERSON VISIT</p>
        <h1 id="visit-title">زمان مراجعه را انتخاب کنید.</h1>
        <p>برای اجرای Demo، یک شعبه و زمان پیشنهادی انتخاب کنید. درخواست به حساب مستقل Personal Shopper متصل می‌شود.</p>
      </section>
      ${accountEmail ? "" : '<p class="d8-form-error">برای ثبت درخواست، ابتدا وارد حساب مستقل Personal Shopper شوید.</p>'}
      ${errorMessage ? `<p class="d8-form-error">${escapeHtml(errorMessage)}</p>` : ""}
      <form class="d8-form" data-visit-form>
        <label>شعبه
          <select name="branchId" required>
            <option value="">انتخاب شعبه</option>
            ${branches.map((item) => `<option value="${escapeHtml(item.identity.id)}" ${item.identity.id === selectedBranchId ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </label>
        <label>زمان مراجعه
          <select name="scheduledAt" required>
            <option value="">انتخاب زمان</option>
            ${slots.map((slot) => `<option value="${slot.toISOString()}">${escapeHtml(formatSlot(slot))}</option>`).join("")}
          </select>
        </label>
        <label>هدف مراجعه
          <select name="purpose">
            <option value="consultation">مشاوره</option>
            <option value="fitting">فیتینگ</option>
          </select>
        </label>
        <label>یادداشت
          <textarea name="notes" rows="4" maxlength="500" placeholder="اختیاری"></textarea>
        </label>
        <button class="button button-primary" type="submit" ${accountEmail ? "" : "disabled"}>ثبت درخواست مراجعه</button>
      </form>
    </main>
  `;
}
