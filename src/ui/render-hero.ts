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
    ? `<a class="hero-cta-primary" href="${escapeHtml(destination)}" data-app-link>${escapeHtml(content.cta.label)}</a>`
    : "";
  const media = content.media.type === "video"
    ? `<video class="hero-image" muted playsinline preload="metadata" poster="${escapeHtml(content.media.poster || "")}"><source src="${escapeHtml(content.media.source)}" type="video/mp4"></video>`
    : `<img class="hero-image" src="${escapeHtml(content.media.source)}" alt="${escapeHtml(content.media.altText || "")}" fetchpriority="high" decoding="async" />`;

  root.innerHTML = `
    <main class="hero-noor" id="main-content" aria-labelledby="hero-title">
      <section class="hero-stage">
        ${media}
        <div class="hero-content">
          <p class="hero-eyebrow" dir="ltr">${escapeHtml(content.subtitle || "THE INTELLIGENT EYEWEAR STUDIO")}</p>
          <h1 class="hero-title" id="hero-title">${escapeHtml(content.title)}</h1>
          ${content.description ? `<p class="hero-body">${escapeHtml(content.description)}</p>` : ""}
          <div class="hero-actions">
            ${primaryCta}
            <a class="hero-cta-secondary" href="/catalog" data-app-link>مشاهده مجموعه</a>
          </div>
        </div>
      </section>
    </main>
  `;
}
