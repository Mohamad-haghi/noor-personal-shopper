import type { HeroContent, HeroContentId } from "../../domain";

export interface HeroContentProvider {
  getHeroContent(id: HeroContentId): Promise<HeroContent | null>;
}

export interface HeroDestinationResolver {
  resolve(
    destination: NonNullable<HeroContent["cta"]>["destination"],
  ): string | null;
}
