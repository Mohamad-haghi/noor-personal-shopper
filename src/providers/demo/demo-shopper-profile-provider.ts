import type { ShopperProfileProvider } from "../interfaces/shopper-profile-provider";
import type { ShopperProfile, ShopperProfileId } from "../../domain";

export class DemoShopperProfileProvider implements ShopperProfileProvider {
  async getProfile(_id: ShopperProfileId): Promise<ShopperProfile | null> { return null; }
  async saveProfile(profile: ShopperProfile): Promise<ShopperProfile> { return profile; }
}
