import type { CommerceOffer, Product, ProductVariant } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function custom(product: Product, key: string): unknown {
  return product.attributes.customAttributes[key];
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

function productCard(product: Product, variant: ProductVariant | null): string {
  const variantAction = variant
    ? `<button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(variant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}">انتخاب برای خرید</button>`
    : `<span class="product-unavailable">در Demo قابل خرید نیست</span>`;

  return `<article class="product-card">
    <a class="product-card-media" href="/products/${encodeURIComponent(product.identity.id)}" data-app-link>${productImage(product)}</a>
    <div class="product-card-body">
      <p class="eyebrow">${escapeHtml(categoryLabel(product))}</p>
      <h2><a href="/products/${encodeURIComponent(product.identity.id)}" data-app-link>${escapeHtml(product.name)}</a></h2>
      <p>${escapeHtml(product.description ?? "جزئیات این فریم در کاتالوگ Demo ثبت شده است.")}</p>
      <div class="product-card-meta"><span>شناسه: ${escapeHtml(product.externalIds.sku ?? product.identity.id)}</span></div>
      <div class="product-card-actions">
        <a class="button button-secondary" href="/products/${encodeURIComponent(product.identity.id)}" data-app-link>جزئیات</a>
        ${variantAction}
      </div>
    </div>
  </article>`;
}

export function renderProducts(
  routeView: HTMLElement,
  products: readonly Product[],
  variantsByProduct: ReadonlyMap<string, readonly ProductVariant[]>,
): void {
  const cards = products.map((product) => {
    const variant = variantsByProduct.get(product.identity.id)?.find((item) => item.availability.isAvailable) ?? null;
    return productCard(product, variant);
  }).join("");

  routeView.innerHTML = `<main class="products-page" id="main-content" aria-labelledby="products-title">
    <section class="products-intro">
      <p class="eyebrow">NOOR PERSONAL SHOPPER · CATALOG</p>
      <h1 id="products-title">کاتالوگ فریم‌ها</h1>
      <p>محصولات این صفحه از CatalogService می‌آیند. در این نسخه، کاتالوگ Demo مستقل است و ساختار آن برای اتصال آینده به کاتالوگ واقعی نور حفظ شده است.</p>
    </section>
    <section class="product-grid" aria-label="فهرست محصولات">${cards}</section>
  </main>`;
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

  const availableVariants = variants.filter((variant) => variant.availability.isAvailable);
  const offerByVariant = new Map(offers.map((offer) => [offer.variantId.id, offer]));
  const shapes = Array.isArray(custom(product, "frameShapes")) ? (custom(product, "frameShapes") as string[]).join(" · ") : "—";
  const material = String(custom(product, "frameMaterial") ?? "—");
  const size = [custom(product,"lensWidthMm"),custom(product,"bridgeWidthMm"),custom(product,"templeLengthMm")].every((v) => typeof v === "number")
    ? [custom(product,"lensWidthMm"),custom(product,"bridgeWidthMm"),custom(product,"templeLengthMm")].join(" / ")
    : "—";

  const variantRows = availableVariants.length
    ? availableVariants.map((variant) => {
        const offer = offerByVariant.get(variant.identity.id);
        const price = offer ? `<span class="product-price">${escapeHtml(offer.pricing.amount.toLocaleString("fa-IR"))} ${escapeHtml(offer.pricing.currency)}</span><small>${escapeHtml(offer.pricing.label)}</small>` : "<span>قیمت در دسترس نیست</span>";
        return `<article class="product-variant-row">
          <div><strong>${escapeHtml(variant.name)}</strong><p>${escapeHtml([variant.attributes.color,variant.attributes.size,variant.attributes.material].filter(Boolean).join(" · ") || "تنوع Demo")}</p></div>
          <div class="product-variant-purchase">${price}<button class="button button-primary" type="button" data-add-to-cart="${escapeHtml(variant.identity.id)}" data-product-id="${escapeHtml(product.identity.id)}">انتخاب برای خرید</button></div>
        </article>`;
      }).join("")
    : `<p class="product-unavailable">در حال حاضر هیچ تنوع قابل خریدی برای این محصول ثبت نشده است.</p>`;

  const gallery = product.media.gallery.length
    ? product.media.gallery.map((image) => `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? product.name)}" loading="lazy">`).join("")
    : productImage(product);

  routeView.innerHTML = `<main class="product-detail-page" id="main-content" aria-labelledby="product-title">
    <a class="product-back" href="/products" data-app-link>← بازگشت به کاتالوگ</a>
    <section class="product-detail-hero">
      <div class="product-detail-media">${gallery}</div>
      <div class="product-detail-copy">
        <p class="eyebrow">${escapeHtml(categoryLabel(product))}</p>
        <h1 id="product-title">${escapeHtml(product.name)}</h1>
        <p class="product-detail-description">${escapeHtml(product.description ?? "جزئیات این فریم در کاتالوگ Demo ثبت شده است.")}</p>
        <dl class="product-specs">
          <div><dt>فرم</dt><dd>${escapeHtml(shapes)}</dd></div>
          <div><dt>جنس</dt><dd>${escapeHtml(material)}</dd></div>
          <div><dt>ابعاد</dt><dd>${escapeHtml(size)}</dd></div>
          <div><dt>شناسه محصول</dt><dd>${escapeHtml(product.externalIds.sku ?? product.identity.id)}</dd></div>
        </dl>
      </div>
    </section>
    <section class="product-variants" aria-labelledby="variants-title">
      <p class="eyebrow">PURCHASE OPTIONS</p>
      <h2 id="variants-title">انتخاب نسخه و ادامه خرید</h2>
      <p class="product-demo-note">قیمت‌ها و موجودی‌های این بخش نمایشی Demo هستند و از CommerceProvider می‌آیند؛ به قیمت یا موجودی واقعی نور متصل نیستند.</p>
      <div class="product-variant-list">${variantRows}</div>
    </section>
  </main>`;
}
