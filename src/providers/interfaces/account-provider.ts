import type { Account, AccountId } from "../../domain";

export interface AccountProvider {
  getAccount(id: AccountId): Promise<Account | null>;
  register(account: Account, password: string): Promise<Account>;
  login(email: string, password: string): Promise<Account | null>;
  getCurrentAccount(): Promise<Account | null>;
  logout(): Promise<void>;
}
