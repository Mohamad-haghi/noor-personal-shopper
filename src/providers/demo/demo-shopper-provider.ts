import type { ShopperProvider } from "../interfaces/shopper-provider";
import type { ShopperProfile, ShopperProfileId } from "../../domain";

export class DemoShopperProvider implements ShopperProvider {
  async getProfile(_id: ShopperProfileId): Promise<ShopperProfile | null> { return null; }

  async saveProfile(profile: ShopperProfile): Promise<ShopperProfile> { return profile; }
}
