import type { Comparison, Product } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"" , "&quot;").replaceAll("'", "&#039;");
}

function custom(product: Product, key: string): unknown {
  return product.attributes.customAttributes[key];
}

export function renderCompare(
  routeView: HTMLElement,
  comparison: Comparison | null,
  products: readonly Product[],
): void {
  if (!comparison || comparison.items.length < 2) {
    routeView.innerHTML = `
      <main class="d5-page" id="main-content">
        <section class="d5-intro">
          <p class="eyebrow">SMART COMPARISON</p>
          <h1>مقایسه</h1>
          <p>برای مقایسه، حداقل دو انتخاب را در «انتخاب‌های من» ذخیره کنید.</p>
          <a class="button button-primary" href="/choices" data-app-link>رفتن به انتخاب‌های من</a>
        </section>
      </main>
    `;
    return;
  }

  const productByVariant = new Map(products.map((product) => [product.identity.id, product]));
  const columns = comparison.items.map((item) => productByVariant.get(item.variantId.productId.id)).filter((product): product is Product => Boolean(product));

  routeView.innerHTML = `
    <main class="d5-page" id="main-content" aria-labelledby="compare-title">
      <section class="d5-intro">
        <p class="eyebrow">SMART COMPARISON</p>
        <h1 id="compare-title">مقایسهٔ انتخاب‌های شما</h1>
        <p>تفاوت‌های کلیدی فریم‌های ذخیره‌شده را کنار هم ببینید.</p>
      </section>
      <section class="d5-compare-wrap" aria-label="جدول مقایسه">
        <table class="d5-compare-table">
          <thead><tr><th>ویژگی</th>${columns.map((product) => `<th>${escapeHtml(product.name)}</th>`).join("")}</tr></thead>
          <tbody>
            <tr><th>نوع</th>${columns.map((product) => `<td>${product.attributes.category === "sunglasses" ? "آفتابی" : "طبی"}</td>`).join("")}</tr>
            <tr><th>فرم فریم</th>${columns.map((product) => `<td>${escapeHtml(Array.isArray(custom(product, "frameShapes")) ? (custom(product, "frameShapes") as string[]).join(" · ") : "—")}</td>`).join("")}</tr>
            <tr><th>جنس</th>${columns.map((product) => `<td>${escapeHtml(String(custom(product, "frameMaterial") ?? "—"))}</td>`).join("")}</tr>
            <tr><th>رنگ</th>${columns.map((product) => `<td>${escapeHtml(String(custom(product, "frameColor") ?? "—"))}</td>`).join("")}</tr>
            <tr><th>ابعاد</th>${columns.map((product) => {
              const values = [custom(product, "lensWidthMm"), custom(product, "bridgeWidthMm"), custom(product, "templeLengthMm")];
              return `<td>${values.every((value) => typeof value === "number") ? escapeHtml(values.join(" / ")) : "—"}</td>`;
            }).join("")}</tr>
            <tr><th>وضعیت</th>${columns.map(() => "<td>در Demo موجود</td>").join("")}</tr>
          </tbody>
        </table>
      </section>
      <div class="d5-actions">
        <a class="button button-primary" href="/choices" data-app-link>ویرایش انتخاب‌ها</a>
        <a class="button button-secondary" href="/shopper" data-app-link>مشاورهٔ دوباره</a>
      </div>
    </main>
  `;
}
