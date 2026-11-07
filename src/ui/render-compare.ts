import type { Comparison, Product } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function custom(product: Product, key: string): unknown {
  return product.attributes.customAttributes[key];
}

function displayFact(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    const values = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    return values.length ? values.join(" · ") : "اطلاعات ثبت نشده";
  }
  return "اطلاعات ثبت نشده";
}

function productImage(product: Product): string {
  const image = product.media.primaryImage;
  return image
    ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? product.name)}" loading="lazy">`
    : `<div class="lab-compare-image-placeholder" aria-hidden="true">NOOR</div>`;
}

function categoryLabel(product: Product): string {
  if (product.attributes.category === "sunglasses") return "آفتابی";
  if (product.attributes.category === "eyeglasses") return "طبی";
  return "اطلاعات ثبت نشده";
}

function dimensionLabel(product: Product): string {
  const values = [custom(product, "lensWidthMm"), custom(product, "bridgeWidthMm"), custom(product, "templeLengthMm")];
  return values.every((value) => typeof value === "number" && Number.isFinite(value))
    ? `${values.join(" / ")} mm`
    : "اطلاعات ثبت نشده";
}

export function renderCompare(
  routeView: HTMLElement,
  comparison: Comparison | null,
  products: readonly Product[],
): void {
  const productByVariant = new Map(products.map((product) => [product.identity.id, product]));
  const columns = comparison
    ? comparison.items.map((item) => productByVariant.get(item.variantId.productId.id)).filter((product): product is Product => Boolean(product))
    : [];

  if (!comparison || comparison.items.length < 2 || columns.length < 2) {
    const hasUnmappedComparison = Boolean(comparison && comparison.items.length >= 2);
    routeView.innerHTML = `
      <main class="lab-compare-page" id="main-content" aria-labelledby="compare-title">
        <header class="lab-compare-head">
          <p class="eyebrow" dir="ltr">FRAME COMPARISON</p>
          <h1 id="compare-title">مقایسهٔ فریم‌ها</h1>
          <p>ویژگی‌های تأییدشده را کنار هم ببینید و انتخاب آگاهانه‌تری داشته باشید.</p>
        </header>
        <section class="lab-compare-empty" role="status">
          <h2>${hasUnmappedComparison ? "اطلاعات کافی برای مقایسه در دسترس نیست." : "فهرست مقایسه خالی است."}</h2>
          <p>${hasUnmappedComparison ? "اطلاعات یکی از محصولات انتخاب‌شده در کاتالوگ فعلی پیدا نشد." : "از صفحه محصولات یا پیشنهادها، حداقل دو فریم را به مقایسه اضافه کنید."}</p>
          <a class="button button-primary" href="/products" data-app-link>مشاهده مجموعه</a>
        </section>
      </main>
    `;
    return;
  }

  const rows: { label: string; value: (product: Product) => string }[] = [
    { label: "نوع", value: categoryLabel },
    { label: "فرم فریم", value: (product) => displayFact(custom(product, "frameShapes")) },
    { label: "جنس فریم", value: (product) => displayFact(custom(product, "frameMaterial")) },
    { label: "رنگ فریم", value: (product) => displayFact(custom(product, "frameColor")) },
    { label: "ابعاد عدسی / پل / دسته", value: dimensionLabel },
  ];

  const headerCells = columns.map((product) => {
    const href = `/products/${encodeURIComponent(product.identity.id)}`;
    return `
      <th scope="col" class="lab-compare-product-head">
        <a class="lab-compare-product-link" href="${href}" data-app-link>
          <span class="lab-compare-media">${productImage(product)}</span>
          <span class="lab-compare-product-name">${escapeHtml(product.name)}</span>
          <span class="lab-compare-product-detail">مشاهده جزئیات</span>
        </a>
      </th>
    `;
  }).join("");

  const bodyRows = rows.map((row) => `
    <tr>
      <th scope="row">${escapeHtml(row.label)}</th>
      ${columns.map((product) => {
        const value = row.value(product);
        const unknown = value === "اطلاعات ثبت نشده";
        return `<td class="${unknown ? "lab-compare-unknown" : ""}">${escapeHtml(value)}</td>`;
      }).join("")}
    </tr>
  `).join("");

  const actionCells = comparison.items.map((item) => {
    const productId = item.variantId.productId.id;
    const product = productByVariant.get(productId);
    return `<td><button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(item.variantId.id)}" data-product-id="${escapeHtml(productId)}">انتخاب برای خرید</button></td>`;
  }).join("");

  routeView.innerHTML = `
    <main class="lab-compare-page" id="main-content" aria-labelledby="compare-title">
      <header class="lab-compare-head">
        <p class="eyebrow" dir="ltr">FRAME COMPARISON</p>
        <h1 id="compare-title">مقایسهٔ انتخاب‌های شما</h1>
        <p>تفاوت‌های کلیدی فریم‌های انتخاب‌شده را با اطلاعات ثبت‌شده در کاتالوگ کنار هم ببینید.</p>
      </header>
      <div class="lab-compare-table-wrap">
        <table class="lab-compare-table">
          <thead><tr><th scope="col">ویژگی</th>${headerCells}</tr></thead>
          <tbody>
            ${bodyRows}
            <tr class="lab-compare-action-row"><th scope="row">اقدام</th>${actionCells}</tr>
          </tbody>
        </table>
      </div>
      <p class="lab-compare-note" role="note">قیمت، موجودی واقعی و امتیاز کاربران در این نسخه نمایشی ارائه نمی‌شوند. اطلاعات نامشخص ساخته یا حدس زده نمی‌شوند.</p>
      <nav class="lab-compare-footer-actions" aria-label="ادامه مسیر انتخاب">
        <a class="button button-primary" href="/choices" data-app-link>ویرایش انتخاب‌ها</a>
        <a class="button button-secondary" href="/shopper" data-app-link>مشاورهٔ دوباره</a>
      </nav>
    </main>
  `;
}
