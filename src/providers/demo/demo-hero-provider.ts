import type { HeroProvider } from "../interfaces/hero-provider";
import type { HeroContent, HeroContentId } from "../../domain";

const heroMediaSource = `${import.meta.env.BASE_URL}media/products/ray-ban-rb3025-181-71/primary.jpeg`;

const DEMO_HERO: HeroContent = {
  identity: { id: "noor-demo-home" },
  title: "عینکی که برای شما انتخاب می‌شود",
  subtitle: "مشاور انتخاب عینک نور",
  description:
    "با چند انتخاب کوتاه، سلیقه و نیاز خود را مشخص کنید و مسیر انتخاب عینک مناسب را شروع کنید.",
  media: {
    type: "image",
    source: heroMediaSource,
    altText: "عینک آفتابی ریبن RB3025 از مجموعه نمایشی نور",
    poster: null,
  },
  cta: {
    label: "شروع مشاوره انتخاب عینک",
    destination: {
      type: "shopper",
      path: "/shopper",
      externalUrl: null,
      productId: null,
      categoryId: null,
    },
    style: "primary",
  },
  display: {
    position: 0,
    alignment: "right",
    overlay: true,
    theme: "dark",
  },
  scheduling: null,
  status: "active",
};

export class DemoHeroProvider implements HeroProvider {
  async getHeroContent(_id?: HeroContentId): Promise<HeroContent | null> {
    return DEMO_HERO;
  }
}
