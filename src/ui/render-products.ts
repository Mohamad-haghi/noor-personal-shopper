import type { CommerceOffer, Product, ProductVariant } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function custom(product: Product, key: string): unknown {
  return product.attributes.customAttributes[key];
}

function displayValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    const values = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    return values.length ? values.join(" · ") : null;
  }
  return null;
}

function productImage(product: Product): string {
  const image = product.media.primaryImage;
  return image
    ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? product.name)}" loading="lazy">`
    : `<div class="product-media-placeholder" aria-hidden="true">NOOR</div>`;
}

function categoryLabel(product: Product): string {
  return product.attributes.category === "sunglasses" ? "عینک آفتابی" : "عینک طبی";
}

function knownFacts(product: Product): string[] {
  return [
    displayValue(custom(product, "frameShapes")),
    displayValue(custom(product, "frameMaterial")) ?? displayValue(custom(product, "frameMaterialComponents")),
    displayValue(custom(product, "frameColor")) ?? displayValue(custom(product, "frameColorComponents")),
  ].filter((value): value is string => Boolean(value));
}

function productCard(product: Product, variant: ProductVariant | null, offer: CommerceOffer | null): string {
  const detailHref = `/products/${encodeURIComponent(product.identity.id)}`;
  const facts = knownFacts(product);
  const variantAction = variant
    ? `<button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(variant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}">انتخاب در دمو</button>`
    : `<span class="product-unavailable">گزینهٔ نمایشی برای انتخاب ثبت نشده</span>`;

  return `<article class="product-card" data-product-category="${product.attributes.category === "sunglasses" ? "sunglasses" : "optical"}">
    <a class="product-card-media" href="${detailHref}" data-app-link aria-label="مشاهدهٔ جزئیات ${escapeHtml(product.name)}">${productImage(product)}</a>
    <div class="product-card-body">
      <div class="product-card-heading"><p class="eyebrow">${escapeHtml(categoryLabel(product))}</p><span class="product-demo-tag">DEMO</span></div>
      <h2><a href="${detailHref}" data-app-link>${escapeHtml(product.name)}</a></h2>
      <p class="product-card-description">${escapeHtml(product.description ?? "توضیحات تکمیلی این فریم هنوز در کاتالوگ ثبت نشده است.")}</p>
      ${facts.length ? `<ul class="product-fact-chips" aria-label="ویژگی‌های ثبت‌شده">${facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>` : `<p class="product-facts-pending">مشخصات تکمیلی این مدل هنوز تأیید نشده است.</p>`}
      <div class="product-card-meta"><span>شناسهٔ مدل</span><strong>${escapeHtml(product.externalIds.sku ?? product.identity.id)}</strong></div>
      <div class="product-demo-price">${offer ? `<strong>${escapeHtml(offer.pricing.amount.toLocaleString("fa-IR"))} ریال</strong>` : `<strong>قیمت ثبت نشده</strong>`}<small>قیمت نمایشی دمو — قیمت واقعی نور نیست</small><small>موجودی فرضی دمو — موجودی واقعی نور نیست</small></div>
      <div class="product-card-actions">
        <a class="button button-secondary" href="${detailHref}" data-app-link>مشاهدهٔ جزئیات</a>
        ${variantAction}
        ${variant ? `<button class="button button-secondary" type="button" data-save-product-choice="${escapeHtml(variant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}">ذخیرهٔ علاقه‌مندی</button><button class="button button-secondary" type="button" data-compare-product="${escapeHtml(variant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}">مقایسه</button>` : ""}
      </div>
    </div>
  </article>`;
}

export function renderProducts(
  routeView: HTMLElement,
  products: readonly Product[],
  variantsByProduct: ReadonlyMap<string, readonly ProductVariant[]>,
  offers: readonly CommerceOffer[],
): void {
  const offersByVariant = new Map(offers.filter((offer) => offer.pricing.source === "demo" && offer.availability.source === "demo").map((offer) => [offer.variantId.id, offer]));
  const cards = products.map((product) => {
    const variant = variantsByProduct.get(product.identity.id)?.find((item) => item.availability.isAvailable && item.availability.source === "demo") ?? null;
    return productCard(product, variant, variant ? offersByVariant.get(variant.identity.id) ?? null : null);
  }).join("");

  routeView.innerHTML = `<main class="products-page lab-catalog-page" id="main-content" aria-labelledby="products-title">
    <section class="products-intro">
      <p class="eyebrow" dir="ltr">THE COLLECTION</p>
      <h1 id="products-title">مجموعه</h1>
      <p>فریم‌ها را مرور کنید و ویژگی‌های ثبت‌شدهٔ هر مدل را بشناسید. فقط اطلاعات تأییدشده نمایش داده می‌شود.</p>
      <aside class="demo-truth-notice" role="note"><strong>نسخهٔ نمایشی</strong><span>این کاتالوگ شامل ${products.length.toLocaleString("fa-IR")} مدل نمونه است. قیمت و موجودی واقعی فروشگاه نور در این نسخه ارائه نمی‌شود؛ مشخصات تأییدنشده خالی می‌مانند.</span></aside>
      <div class="catalog-shopper-cta"><a class="button button-primary" href="/shopper" data-app-link>مشاوره انتخاب شخصی</a></div>
      <div class="lab-catalog-filters" role="group" aria-label="فیلتر نوع محصول">
        <button type="button" class="lab-filter-chip" data-catalog-filter="all" aria-pressed="true">همه</button>
        <button type="button" class="lab-filter-chip" data-catalog-filter="optical" aria-pressed="false">طبی</button>
        <button type="button" class="lab-filter-chip" data-catalog-filter="sunglasses" aria-pressed="false">آفتابی</button>
        <span class="catalog-count" aria-live="polite">${products.length.toLocaleString("fa-IR")} فریم</span>
      </div>
    </section>
    <section class="product-grid" aria-label="فهرست محصولات">${cards || '<p class="catalog-empty">در حال حاضر مدلی برای نمایش ثبت نشده است.</p>'}</section>
  </main>`;

  routeView.querySelectorAll<HTMLButtonElement>("[data-catalog-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.catalogFilter ?? "all";
      routeView.querySelectorAll<HTMLElement>("[data-product-category]").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.productCategory !== filter;
      });
      routeView.querySelectorAll<HTMLButtonElement>("[data-catalog-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      const count = routeView.querySelector<HTMLElement>(".catalog-count");
      const visible = [...routeView.querySelectorAll<HTMLElement>("[data-product-category]")].filter((card) => !card.hidden).length;
      if (count) count.textContent = `${visible.toLocaleString("fa-IR")} فریم`;
    });
  });
}

function specRow(label: string, value: unknown): string {
  const rendered = displayValue(value);
  return rendered
    ? `<div class="product-spec-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(rendered)}</dd></div>`
    : "";
}

export function renderProductDetail(
  routeView: HTMLElement,
  product: Product | null,
  variants: readonly ProductVariant[],
  offers: readonly CommerceOffer[],
): void {
  if (!product) {
    routeView.innerHTML = `<main class="route-placeholder" id="main-content"><p class="eyebrow">CATALOG</p><h1>محصول پیدا نشد</h1><p class="summary">این محصول در کاتالوگ فعلی Demo وجود ندارد.</p><div class="route-actions"><a class="button button-secondary" href="/products" data-app-link>بازگشت به کاتالوگ</a></div></main>`;
    return;
  }

  const availableVariants = variants.filter((variant) => variant.availability.isAvailable && variant.availability.source === "demo");
  const offerByVariant = new Map(offers.filter((offer) => offer.pricing.source === "demo" && offer.availability.source === "demo").map((offer) => [offer.variantId.id, offer]));
  const dimensions = [custom(product, "lensWidthMm"), custom(product, "bridgeWidthMm"), custom(product, "templeLengthMm")];
  const sizeValue = dimensions.every((value) => typeof value === "number" && Number.isFinite(value))
    ? dimensions.map((value) => String(value)).join(" / ") + " میلی‌متر"
    : null;

  const variantRows = availableVariants.length
    ? availableVariants.map((variant) => {
        const offer = offerByVariant.get(variant.identity.id);
        const price = offer
          ? `<span class="product-price">${escapeHtml(offer.pricing.amount.toLocaleString("fa-IR"))} ریال</span><small>قیمت نمایشی دمو</small>`
          : "<span>قیمت نمایشی ثبت نشده</span>";
        return `<article class="product-variant-row">
          <div class="product-variant-info"><strong>${escapeHtml(variant.name)}</strong><p>${escapeHtml([variant.attributes.color, variant.attributes.size, variant.attributes.material].filter(Boolean).join(" · ") || "تنوع نمایشی")}</p></div>
          <div class="product-variant-purchase">${price}<button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(variant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}">انتخاب در دمو</button><button class="button button-secondary" type="button" data-save-product-choice="${escapeHtml(variant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}">ذخیرهٔ علاقه‌مندی</button><button class="button button-secondary" type="button" data-compare-product="${escapeHtml(variant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}">افزودن به مقایسه</button></div>
        </article>`;
      }).join("")
    : `<p class="product-unavailable">برای این مدل، گزینهٔ انتخاب نمایشی ثبت نشده است.</p>`;

  const images = product.media.gallery.length ? product.media.gallery : product.media.primaryImage ? [product.media.primaryImage] : [];
  const gallery = images.length
    ? images.map((image, index) => `<figure class="product-gallery-item"><img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? product.name)}" loading="${index === 0 ? "eager" : "lazy"}">${images.length > 1 ? `<figcaption>تصویر ${(index + 1).toLocaleString("fa-IR")}</figcaption>` : ""}</figure>`).join("")
    : `<div class="product-media-placeholder product-detail-placeholder" role="img" aria-label="تصویر این محصول در کاتالوگ ثبت نشده">NOOR</div>`;

  const specs = [
    specRow("فرم فریم", custom(product, "frameShapes")),
    specRow("جنس فریم", custom(product, "frameMaterial") ?? custom(product, "frameMaterialComponents")),
    specRow("رنگ فریم", custom(product, "frameColor") ?? custom(product, "frameColorComponents")),
    specRow("رنگ عدسی", custom(product, "lensColor")),
    specRow("ابعاد عدسی / پل / دسته", sizeValue),
    specRow("گروه محصول", custom(product, "gender")),
    specRow("شناسهٔ دقیق مدل", product.externalIds.sku ?? product.identity.id),
  ].filter(Boolean).join("");

  routeView.innerHTML = `<main class="product-detail-page" id="main-content" aria-labelledby="product-title">
    <a class="product-back" href="/products" data-app-link>← بازگشت به کاتالوگ</a>
    <section class="product-detail-hero">
      <div class="product-detail-media" aria-label="تصویر محصول">${gallery}</div>
      <div class="product-detail-copy">
        <p class="eyebrow">${escapeHtml(categoryLabel(product))} · NOOR EDIT</p>
        <h1 id="product-title">${escapeHtml(product.name)}</h1>
        <p class="product-detail-description">${escapeHtml(product.description ?? "توضیحات تکمیلی این فریم هنوز در کاتالوگ ثبت نشده است.")}</p>
        <div class="product-detail-truth"><span class="product-demo-tag">DEMO</span><span>معرفی نمایشی؛ بدون فروش یا موجودی زنده</span></div>
        <section class="product-spec-panel" aria-labelledby="product-spec-title"><div class="product-section-heading"><p class="eyebrow">PRODUCT DETAILS</p><h2 id="product-spec-title">مشخصات ثبت‌شده</h2></div>
          ${specs ? `<dl class="product-specs">${specs}</dl>` : '<p class="product-facts-pending">هنوز مشخصات تأییدشده‌ای برای نمایش ثبت نشده است.</p>'}
          <p class="product-data-note">فقط اطلاعات موجود در کاتالوگ نمایش داده شده‌اند؛ موارد نامشخص عمداً حدس زده نشده‌اند.</p>
        </section>
      </div>
    </section>
    <section class="product-variants" aria-labelledby="variants-title">
      <div class="product-section-heading"><p class="eyebrow">DEMO OPTIONS</p><h2 id="variants-title">گزینه‌های نمایشی</h2><p>این بخش برای نمایش جریان انتخاب، علاقه‌مندی و مقایسه در دمو ساخته شده است.</p></div>
      <aside class="demo-truth-notice" role="note"><strong>شفافیت دمو</strong><span>قیمت نمایشی دمو — قیمت واقعی نور نیست. موجودی فرضی دمو — موجودی واقعی نور نیست. این گزینه‌ها به سامانه فروش زنده متصل نیستند.</span></aside>
      <div class="product-shopper-cta"><a class="button button-secondary" href="/shopper" data-app-link>برای بررسی تناسب انتخاب با نیازتان از دستیار کمک بگیرید</a></div>
      <div class="product-variant-list">${variantRows}</div>
    </section>
  </main>`;
}
