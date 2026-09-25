import type { HeroProvider } from "../providers/interfaces/hero-provider";
import type { HeroContent, HeroContentId } from "../../domain";

export class HeroService {
  constructor(private readonly provider: HeroProvider) {}

  getHeroContent(id?: HeroContentId): Promise<HeroContent | null> {
    return this.provider.getHeroContent(id);
  }
}
