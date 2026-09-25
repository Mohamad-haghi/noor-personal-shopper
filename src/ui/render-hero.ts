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
  const cta = content.cta && destination
    ? `<a class="hero-cta hero-cta-primary" href="${escapeHtml(destination)}" data-app-link>${escapeHtml(content.cta.label)}</a>`
    : "";

  const media = content.media.type === "video"
    ? `<video class="hero-media" autoplay muted loop playsinline preload="metadata" poster="${escapeHtml(content.media.poster || "")}><source src="${escapeHtml(content.media.source)}" type="video/mp4"></video>`
    : `<img class="hero-media" src="${escapeHtml(content.media.source)}" alt="${escapeHtml(content.media.altText || "")}" />`;

  root.innerHTML = `
    <main class="hero" id="main-content" aria-labelledby="hero-title">
      <div class="hero-media-layer" aria-hidden="true">${media}</div>
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="hero-content">
        <p class="hero-kicker">${escapeHtml(content.subtitle || "NOOR Personal Shopper")}</p>
        <h1 id="hero-title">${escapeHtml(content.title)}</h1>
        ${content.description ? `<p class="hero-description">${escapeHtml(content.description)}</p>` : ""}
        ${cta}
        <p class="hero-note">دموی مستقل · آماده برای اتصال آینده به محتوای نور</p>
      </div>
    </main>
  `;
}
