import type { HeroContent, HeroContentId } from "../../domain";

export interface HeroProvider {
  getHeroContent(id?: HeroContentId): Promise<HeroContent | null>;
}
