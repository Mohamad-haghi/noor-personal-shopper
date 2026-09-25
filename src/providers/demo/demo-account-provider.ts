import type { Account, AccountId } from "../../domain";

export class DemoAccountProvider implements AccountProvider {
  async getAccount(id: AccountId): Promise<Account | null> { return null; }

  async register(account: Account, password: string): Promise<Account> { return account; }

  async login(email: string, password: string): Promise<Account | null> { return null; }

  async getCurrentAccount(): Promise<Account | null> { return null; }

  async logout(): Promise<void> {}
}
