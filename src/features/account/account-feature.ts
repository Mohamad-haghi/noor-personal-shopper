import type { AccountId } from "../../domain";

export interface AccountState {
  readonly accountId: AccountId | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
}

export class AccountFeature {
  getState(): AccountState {
    return {
      accountId: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
}
