import type { HeroContent } from "../domain";

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
): void {
  const primaryCta = content.cta && destination
    ? `<a class="hero-cta hero-cta-primary" href="${escapeHtml(destination)}" data-app-link>${escapeHtml(content.cta.label)}</a>`
    : "";
  const media = content.media.type === "video"
    ? `<video class="hero-media" muted playsinline preload="metadata" poster="${escapeHtml(content.media.poster || "")}"><source src="${escapeHtml(content.media.source)}" type="video/mp4"></video>`
    : `<img class="hero-media" src="${escapeHtml(content.media.source)}" alt="${escapeHtml(content.media.altText || "")}" />`;

  root.innerHTML = `
    <main class="hero" id="main-content" aria-labelledby="hero-title">
      <section class="hero-copy">
        <p class="hero-kicker" dir="ltr">THE INTELLIGENT EYEWEAR STUDIO</p>
        <h1 id="hero-title">${escapeHtml(content.title)}</h1>
        ${content.description ? `<p class="hero-description">${escapeHtml(content.description)}</p>` : ""}
        <div class="hero-actions">
          ${primaryCta}
          <a class="hero-cta hero-cta-secondary" href="/catalog" data-app-link>مشاهده مجموعه</a>
        </div>
        <p class="hero-note">نمونهٔ نمایشی مستقل · بدون فروش واقعی</p>
      </section>
      <figure class="hero-visual">
        <div class="hero-media-stage">${media}</div>
        <figcaption class="hero-product-caption">
          <strong dir="ltr">Ray-Ban RB3025 181/71</strong>
          <span>خلبانی · فلز · طلایی</span>
        </figcaption>
      </figure>
    </main>
  `;
}
