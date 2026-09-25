import type { ShopperProvider } from "../providers/interfaces/shopper-provider";
import type { ShopperProfile, ShopperProfileId } from "../../domain";

export class ShopperService {
  constructor(private readonly provider: ShopperProvider) {}

  getProfile(id: ShopperProfileId): Promise<ShopperProfile | null> {
    return this.provider.getProfile(id);
  }

  saveProfile(profile: ShopperProfile): Promise<ShopperProfile> {
    return this.provider.saveProfile(profile);
  }
}
