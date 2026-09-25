export interface HeroContentId {
  readonly id: string;
}

export interface HeroContent {
  readonly identity: HeroContentId;
  readonly title: string;
  readonly subtitle: string | null;
  readonly description: string | null;
  readonly media: HeroMedia;
  readonly cta: HeroCTA | null;
  readonly display: HeroDisplay;
  readonly scheduling: HeroScheduling | null;
  readonly status: HeroStatus;
}

export interface HeroMedia {
  readonly type: HeroMediaType;
  readonly source: string;
  readonly altText: string | null;
  readonly poster: string | null;
}

export type HeroMediaType = "image" | "video" | "carousel";

export interface HeroCTA {
  readonly label: string;
  readonly destination: HeroDestination;
  readonly style: CTASTyle;
}

export interface HeroDestination {
  readonly type: HeroDestinationType;
  readonly path: string | null;
  readonly externalUrl: string | null;
  readonly productId: string | null;
  readonly categoryId: string | null;
}

export type HeroDestinationType = "route" | "product" | "category" | "external" | "shopper" | "none";

export type CTASTyle = "primary" | "secondary" | "outline" | "ghost";

export interface HeroDisplay {
  readonly position: number;
  readonly alignment: HeroAlignment;
  readonly overlay: boolean;
  readonly theme: HeroTheme;
}

export type HeroAlignment = "left" | "center" | "right";

export type HeroTheme = "light" | "dark" | "auto";

export interface HeroScheduling {
  readonly startsAt: Date | null;
  readonly endsAt: Date | null;
  readonly priority: number;
}

export type HeroStatus = "active" | "inactive" | "scheduled" | "expired";
