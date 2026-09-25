import type { ShopperProfile, ShopperProfileId } from "../../domain";

export interface ShopperProfileProvider {
  getProfile(id: ShopperProfileId): Promise<ShopperProfile | null>;
  saveProfile(profile: ShopperProfile): Promise<ShopperProfile>;
}
