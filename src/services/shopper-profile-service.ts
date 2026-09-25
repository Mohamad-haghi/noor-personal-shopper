import type { ShopperProfile, ShopperProfileId } from "../domain";
import type { ShopperProfileProvider } from "../providers/interfaces/shopper-profile-provider";

export class ShopperProfileService {
  constructor(private readonly provider: ShopperProfileProvider) {}

  get(id: ShopperProfileId): Promise<ShopperProfile | null> { return this.provider.getProfile(id); }
  save(profile: ShopperProfile): Promise<ShopperProfile> { return this.provider.saveProfile(profile); }
}
