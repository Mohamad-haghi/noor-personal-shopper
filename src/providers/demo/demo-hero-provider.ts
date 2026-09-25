import type { HeroContent, HeroContentId } from "../../domain";

export class DemoHeroProvider implements HeroProvider {
  async getHeroContent(id?: HeroContentId): Promise<HeroContent | null> { return null; }
}
