import type { ShopperProfile, ShopperProfileId } from "../../domain";

export interface ShopperProvider {
  getProfile(id: ShopperProfileId): Promise<ShopperProfile | null>;
  saveProfile(profile: ShopperProfile): Promise<ShopperProfile>;
}
