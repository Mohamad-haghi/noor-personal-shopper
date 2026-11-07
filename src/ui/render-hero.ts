import type { HeroContent, Product, ProductVariant } from "../domain";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderHero(
  root: HTMLElement,
  content: HeroContent,
  destination: string | null,
  products: readonly Product[] = [],
  variantsByProduct: ReadonlyMap<string, readonly ProductVariant[]> = new Map(),
  savedVariantIds: ReadonlySet<string> = new Set(),
): void {
  const primaryCta = content.cta && destination
    ? `<a class="hero-cta-primary" href="${escapeHtml(destination)}" data-app-link>${escapeHtml(content.cta.label)}</a>`
    : "";
  const media = content.media.type === "video"
    ? `<video class="hero-image" muted playsinline preload="metadata" poster="${escapeHtml(content.media.poster || "")}"><source src="${escapeHtml(content.media.source)}" type="video/mp4"></video>`
    : `<img class="hero-image" src="${escapeHtml(content.media.source)}" alt="${escapeHtml(content.media.altText || "")}" fetchpriority="high" decoding="async" />`;

  // Use canonical DemoCatalogSeed IDs; display slugs omit the noor-demo-NNN prefix.
  const curatedIds = [
    "noor-demo-002-persol-po0649-95-31",
    "noor-demo-003-oakley-oo9318-02-34",
    "noor-demo-012-prada-pr51yv-04q1o1",
  ];
  const curatedProducts = curatedIds.map((id) => products.find((product) => product.identity.id === id)).filter((product): product is Product => Boolean(product));
  const curated = curatedProducts.map((product) => {
    const image = product.media.primaryImage;
    const imageMarkup = image
      ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? product.name)}" loading="lazy">`
      : `<span class="lab-product-placeholder" aria-hidden="true">NOOR</span>`;
    const productVariants = variantsByProduct.get(product.identity.id) ?? [];
    const favoriteVariant = productVariants.find((variant) => variant.availability.isAvailable && variant.availability.source === "demo")
      ?? productVariants[0];
    const isSaved = favoriteVariant ? savedVariantIds.has(favoriteVariant.identity.id) : false;
    const favoriteAction = favoriteVariant
      ? `<button class="lab-curated-favorite${isSaved ? " is-saved" : ""}" type="button" data-home-favorite-toggle data-variant-id="${escapeHtml(favoriteVariant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}" aria-label="${isSaved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}" aria-pressed="${String(isSaved)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg></button>`
      : "";
    return `<article class="lab-curated-item">
      <a href="/products/${encodeURIComponent(product.identity.id)}" data-app-link>
        <div class="lab-curated-image">${imageMarkup}</div>
        <h3>${escapeHtml(product.name)}</h3>
        <span>مشاهده جزئیات</span>
      </a>
      ${favoriteAction}
    </article>`;
  }).join("");
  const titleMarkup = escapeHtml(content.title).replace("شناخت شما", '<span class="hero-accent">شناخت شما</span>');

  root.innerHTML = `
    <main class="lab-home" id="main-content" aria-labelledby="hero-title">
      <section class="hero-noor">
        <div class="hero-stage">
          ${media}
          <div class="hero-content">
            <p class="hero-eyebrow" dir="ltr">${escapeHtml(content.subtitle || "THE INTELLIGENT EYEWEAR STUDIO")}</p>
            <h1 class="hero-title" id="hero-title">${titleMarkup}</h1>
            ${content.description ? `<p class="hero-body">${escapeHtml(content.description)}</p>` : ""}
            <div class="hero-actions">
              ${primaryCta}
              <a class="hero-cta-secondary" href="/catalog" data-app-link>مشاهده مجموعه</a>
            </div>
            <p class="hero-muted lab-demo-caption">نسخهٔ نمایشی NOOR · بدون فروش یا موجودی زنده</p>
          </div>
        </div>
      </section>

      <section class="lab-home-section" aria-labelledby="lab-guided-title">
        <p class="eyebrow" dir="ltr">THE GUIDED STYLIST</p>
        <h2 id="lab-guided-title">سه گام تا انتخابی سنجیده</h2>
        <ol class="lab-step-grid">
          <li><span>01</span><h3>گفت‌وگو</h3><p>در چند پرسش کوتاه، سلیقه و نیازتان را مشخص می‌کنید.</p></li>
          <li><span>02</span><h3>پروفایل انتخاب</h3><p>ترجیحات شما در یک پروفایل ساختاریافته ثبت می‌شود و قابل ویرایش است.</p></li>
          <li><span>03</span><h3>پیشنهاد شفاف</h3><p>پس از تأیید پروفایل، مسیر اصلی NOOR و COR پیشنهادها و دلایلشان را بررسی می‌کند.</p></li>
        </ol>
      </section>

      <section class="lab-home-section lab-curated-section" aria-labelledby="lab-curated-title">
        <div class="lab-section-heading"><div><p class="eyebrow" dir="ltr">CURATED SELECTION</p><h2 id="lab-curated-title">گزیدهٔ مجموعه</h2></div>
          <a href="/catalog" data-app-link>همهٔ مجموعه</a></div>
        <div class="lab-curated-grid">${curated || '<p>محصولی برای نمایش ثبت نشده است.</p>'}</div>
      </section>

      <section class="lab-cor-section" aria-labelledby="lab-cor-title">
        <div><p class="eyebrow" dir="ltr">POWERED BY COR DECISION INTELLIGENCE</p>
          <h2 id="lab-cor-title">هوشمندی‌ای که دلیلش را می‌گوید.</h2>
          <p>در مسیر پیشنهادها، COR ترجیحات شما را با داده‌های ثبت‌شدهٔ محصولات ارزیابی می‌کند. NOOR نتیجه و دلایل تطابق یا عدم تطابق را نمایش می‌دهد؛ دادهٔ نامشخص نیز به‌جای حدس‌زدن، نامشخص باقی می‌ماند.</p>
          <a class="lab-text-link" href="/how-it-works" data-app-link>NOOR چگونه کار می‌کند</a>
        </div>
        <div class="lab-cor-visual" aria-label="مراحل تصمیم‌گیری"><span>ترجیحات شما</span><i aria-hidden="true">↓</i><strong>COR</strong><i aria-hidden="true">↓</i><span>دلایل و نتیجهٔ قابل بررسی</span></div>
      </section>

      <section class="lab-home-cta"><h2>آماده‌اید انتخاب را آغاز کنیم؟</h2>
        <p>با چند پرسش کوتاه، پروفایل انتخابتان را بسازید.</p>
        <a class="button button-primary" href="/shopper" data-app-link>شروع مشاوره انتخاب عینک</a>
      </section>
    </main>
  `;
}
