import type { CommerceOffer, Product, ProductVariant } from "../domain";

export interface ManagerOverviewData {
  readonly products: readonly Product[];
  readonly variants: readonly ProductVariant[];
  readonly offers: readonly CommerceOffer[];
}

function hasArrayValue(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

export function renderManagerOverview(root: HTMLElement, data: ManagerOverviewData): void {
  const availableDemoVariants = data.variants.filter(
    (variant) => variant.availability.source === "demo" && variant.availability.isAvailable,
  ).length;
  const demoOffers = data.offers.filter(
    (offer) => offer.pricing.source === "demo" && offer.availability.source === "demo",
  ).length;
  const total = data.products.length;
  const coverage = [
    { label: "نوع", count: data.products.filter((product) => Boolean(product.attributes.category)).length },
    { label: "فرم", count: data.products.filter((product) => hasArrayValue(product.attributes.customAttributes.frameShapes)).length },
    { label: "جنس", count: data.products.filter((product) => Boolean(product.attributes.customAttributes.frameMaterial)).length },
    { label: "رنگ", count: data.products.filter((product) => Boolean(product.attributes.customAttributes.frameColor)).length },
  ];

  const coverageRows = coverage.map((field) => {
    const percent = total ? Math.round((field.count / total) * 100) : 0;
    return `
      <li class="lab-manager-coverage-row">
        <div><span>${field.label}</span><span class="lab-manager-coverage-count">${field.count.toLocaleString("fa-IR")} از ${total.toLocaleString("fa-IR")}</span></div>
        <div class="lab-manager-coverage-track" role="progressbar" aria-label="پوشش ${field.label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
          <span style="width: ${percent}%"></span>
        </div>
      </li>
    `;
  }).join("");

  root.innerHTML = `
    <main class="manager-overview lab-manager-page" id="main-content" aria-labelledby="manager-title">
      <header class="lab-manager-head">
        <p class="eyebrow" dir="ltr">MANAGER · ILLUSTRATIVE</p>
        <h1 id="manager-title">پوشش شواهد کاتالوگ</h1>
        <p>نمایی از کامل‌بودن ویژگی‌های ثبت‌شده در کاتالوگ نمایشی NOOR؛ این صفحه داشبورد عملیاتی یا گزارش فروش واقعی نیست.</p>
      </header>
      <aside class="demo-truth-notice lab-manager-note" role="note">
        <strong>نمای تصویری از داده‌های Demo</strong>
        <span>اعداد از کاتالوگ نمایشی شمارش شده‌اند و شامل فروش، موجودی، سفارش یا رفتار واقعی مشتری نیستند.</span>
      </aside>
      <section class="lab-manager-coverage" aria-labelledby="manager-coverage-title">
        <div class="lab-manager-section-head">
          <p class="eyebrow">CATALOG EVIDENCE</p>
          <h2 id="manager-coverage-title">پوشش ویژگی‌های محصول</h2>
          <p>درصد محصولات نمونه که برای هر ویژگی، دادهٔ ثبت‌شده دارند.</p>
        </div>
        <ul class="lab-manager-coverage-list">${coverageRows}</ul>
      </section>
      <section class="manager-stat-grid lab-manager-stat-grid" aria-label="وضعیت کاتالوگ نمونه">
        <article class="manager-stat lab-manager-stat"><span>محصولات نمونه</span><strong>${total.toLocaleString("fa-IR")}</strong><small>مجموعه کنترل‌شده دمو</small></article>
        <article class="manager-stat lab-manager-stat"><span>تنوع‌های فرضیِ قابل انتخاب</span><strong>${availableDemoVariants.toLocaleString("fa-IR")}</strong><small>موجودی واقعی نور نیست</small></article>
        <article class="manager-stat lab-manager-stat"><span>قیمت‌های نمایشی</span><strong>${demoOffers.toLocaleString("fa-IR")}</strong><small>قیمت واقعی یا قیمت روز نیست</small></article>
      </section>
      <section class="manager-panel lab-manager-panel" aria-labelledby="manager-capabilities-title">
        <h2 id="manager-capabilities-title">قابلیت‌های قابل نمایش</h2>
        <ul>
          <li><strong>کاتالوگ نمونه:</strong> دریافت و نمایش محصولات تعریف‌شده برای دمو.</li>
          <li><strong>دستیار خرید:</strong> جمع‌آوری ترجیحات و تولید پیشنهاد از مجموعه محصولات نمونه.</li>
          <li><strong>توضیح و مقایسه:</strong> نمایش دلیل پیشنهادها و مقایسه ویژگی‌های ثبت‌شده.</li>
          <li><strong>مسیر مراجعه به نور:</strong> ادامه مسیر از طریق مقصد بیرونی؛ اتصال زنده کاتالوگ تأیید نشده است.</li>
        </ul>
      </section>
      <section class="manager-panel lab-manager-panel" aria-labelledby="manager-readiness-title">
        <h2 id="manager-readiness-title">وضعیت اتصال و اندازه‌گیری</h2>
        <dl class="manager-status-list lab-manager-status-list">
          <div><dt>منبع واقعی محصولات نور</dt><dd>متصل نیست</dd></div>
          <div><dt>قیمت و موجودی زنده</dt><dd>در دسترس نیست؛ داده‌ها فرضی‌اند</dd></div>
          <div><dt>ثبت واقعی رفتار مشتری</dt><dd>فعال/تأیید نشده</dd></div>
          <div><dt>فروش و تبدیل واقعی</dt><dd>قابل گزارش نیست</dd></div>
        </dl>
      </section>
      <p class="manager-footnote lab-manager-footnote">در پایلوت واقعی، فقط پس از تأیید نور، اتصال داده و ابزار اندازه‌گیری، شاخص‌های واقعی با منبع و بازه زمانی مشخص نمایش داده می‌شوند.</p>
      <nav class="route-actions lab-manager-actions" aria-label="گام بعدی">
        <a class="button button-primary" href="/shopper" data-app-link>مشاهده دستیار خرید</a>
        <a class="button button-secondary" href="/products" data-app-link>مشاهده کاتالوگ نمونه</a>
      </nav>
    </main>
  `;
}
