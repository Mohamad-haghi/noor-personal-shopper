import type { CommerceOffer, Product, ProductVariant } from "../domain";

export interface ManagerOverviewData {
  readonly products: readonly Product[];
  readonly variants: readonly ProductVariant[];
  readonly offers: readonly CommerceOffer[];
}

export function renderManagerOverview(root: HTMLElement, data: ManagerOverviewData): void {
  const availableDemoVariants = data.variants.filter(
    (variant) => variant.availability.source === "demo" && variant.availability.isAvailable,
  ).length;
  const demoOffers = data.offers.filter(
    (offer) => offer.pricing.source === "demo" && offer.availability.source === "demo",
  ).length;

  root.innerHTML = `
    <main class="manager-overview" id="main-content" aria-labelledby="manager-title">
      <p class="eyebrow">NOOR PERSONAL SHOPPER · MANAGER VIEW</p>
      <h1 id="manager-title">نمای کلی مدیر</h1>
      <p class="manager-lead">نمایش سطح یک برای معرفی قابلیت‌های دستیار خرید. این صفحه داشبورد عملیاتی یا گزارش فروش واقعی نیست.</p>
      <aside class="demo-truth-notice" role="note">
        <strong>همه اعداد مربوط به داده‌های نمایشی هستند</strong>
        <span>این دمو به سامانه‌های زنده نور، سفارش واقعی، پرداخت واقعی یا ابزار تحلیل رفتار مشتری متصل نیست. هیچ عددی در این صفحه به‌عنوان نتیجه واقعی کسب‌وکار گزارش نمی‌شود.</span>
      </aside>
      <section class="manager-stat-grid" aria-label="وضعیت کاتالوگ نمونه">
        <article class="manager-stat"><span>محصولات نمونه</span><strong>${data.products.length}</strong><small>مجموعه کنترل‌شده دمو</small></article>
        <article class="manager-stat"><span>تنوع‌های فرضیِ قابل انتخاب</span><strong>${availableDemoVariants}</strong><small>موجودی واقعی نور نیست</small></article>
        <article class="manager-stat"><span>قیمت‌های نمایشی</span><strong>${demoOffers}</strong><small>قیمت واقعی یا قیمت روز نیست</small></article>
      </section>
      <section class="manager-panel" aria-labelledby="manager-capabilities-title">
        <h2 id="manager-capabilities-title">قابلیت‌های قابل نمایش</h2>
        <ul>
          <li><strong>کاتالوگ نمونه:</strong> دریافت و نمایش اطلاعات ۱۵ محصول تعریف‌شده برای دمو.</li>
          <li><strong>دستیار خرید:</strong> جمع‌آوری ترجیحات و تولید پیشنهاد از مجموعه محصولات نمونه.</li>
          <li><strong>توضیح و مقایسه:</strong> نمایش دلیل پیشنهادها و مقایسه ویژگی‌های ثبت‌شده.</li>
          <li><strong>مسیر مراجعه به نور:</strong> امکان ادامه مسیر از طریق مقصد بیرونی؛ اتصال زنده کاتالوگ تأیید نشده است.</li>
        </ul>
      </section>
      <section class="manager-panel" aria-labelledby="manager-readiness-title">
        <h2 id="manager-readiness-title">وضعیت اتصال و اندازه‌گیری</h2>
        <dl class="manager-status-list">
          <div><dt>منبع واقعی محصولات نور</dt><dd>متصل نیست</dd></div>
          <div><dt>قیمت و موجودی زنده</dt><dd>در دسترس نیست؛ داده‌ها فرضی‌اند</dd></div>
          <div><dt>ثبت واقعی رفتار مشتری</dt><dd>فعال/تأیید نشده</dd></div>
          <div><dt>فروش و تبدیل واقعی</dt><dd>قابل گزارش نیست</dd></div>
        </dl>
      </section>
      <p class="manager-footnote">در پایلوت واقعی، فقط پس از تأیید نور، اتصال داده و ابزار اندازه‌گیری، شاخص‌های واقعی با منبع و بازه زمانی مشخص نمایش داده می‌شوند.</p>
      <div class="route-actions"><a class="button button-primary" href="/shopper" data-app-link>مشاهده دستیار خرید</a><a class="button button-secondary" href="/products" data-app-link>مشاهده کاتالوگ نمونه</a></div>
    </main>
  `;
}
