import type { AccountId, SelectionProfile, SelectionProfileId } from "../../domain";

export interface SelectionProfileProvider {
  getProfile(id: SelectionProfileId): Promise<SelectionProfile | null>;
  saveProfile(profile: SelectionProfile): Promise<SelectionProfile>;
  listProfilesForAccount(accountId: AccountId): Promise<readonly SelectionProfile[]>;
}
