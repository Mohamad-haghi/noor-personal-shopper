import type { AccountId, SelectionProfile, SelectionProfileId } from "../../domain";
import type { SelectionProfileProvider } from "../interfaces/selection-profile-provider";

export class DemoSelectionProfileProvider implements SelectionProfileProvider {
  private readonly profiles = new Map<string, SelectionProfile>();

  async getProfile(id: SelectionProfileId): Promise<SelectionProfile | null> {
    return this.profiles.get(id.id) ?? null;
  }

  async saveProfile(profile: SelectionProfile): Promise<SelectionProfile> {
    this.profiles.set(profile.identity.id, profile);
    return profile;
  }

  async listProfilesForAccount(accountId: AccountId): Promise<readonly SelectionProfile[]> {
    return [...this.profiles.values()]
      .filter((profile) => profile.accountId?.id === accountId.id)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}
