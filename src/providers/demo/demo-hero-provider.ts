import type { HeroProvider } from "../interfaces/hero-provider";
import type { HeroContent, HeroContentId } from "../../domain";

export class DemoHeroProvider implements HeroProvider {
  async getHeroContent(_id?: HeroContentId): Promise<HeroContent | null> { return null; }
}
