import type { HeroDestinationResolver } from "../interfaces/hero-integration";
import type { HeroDestination } from "../../domain";

export class DemoHeroDestinationResolver implements HeroDestinationResolver {
  resolve(destination: HeroDestination): string | null {
    if (destination.type === "shopper") return destination.path || "/shopper";
    if (destination.type === "route") return destination.path;
    return null;
  }
}
