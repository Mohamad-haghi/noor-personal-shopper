import type { AccountId, SelectionProfile, SelectionProfileId } from "../domain";
import type { SelectionProfileProvider } from "../providers/interfaces/selection-profile-provider";

export class SelectionProfileService {
  constructor(private readonly provider: SelectionProfileProvider) {}

  getProfile(id: SelectionProfileId): Promise<SelectionProfile | null> {
    return this.provider.getProfile(id);
  }

  saveProfile(profile: SelectionProfile): Promise<SelectionProfile> {
    return this.provider.saveProfile(profile);
  }

  listProfilesForAccount(accountId: AccountId): Promise<readonly SelectionProfile[]> {
    return this.provider.listProfilesForAccount(accountId);
  }
}
