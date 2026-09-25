import type { ShopperProfile, ShopperProfileId } from "../../domain";

export class DemoShopperProvider implements ShopperProvider {
  async getProfile(id: ShopperProfileId): Promise<ShopperProfile | null> { return null; }

  async saveProfile(profile: ShopperProfile): Promise<ShopperProfile> { return profile; }
}
