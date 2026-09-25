import type { AccountProvider } from "../interfaces/account-provider";
import type { Account, AccountId } from "../../domain";

export class DemoAccountProvider implements AccountProvider {
  async getAccount(_id: AccountId): Promise<Account | null> { return null; }

  async register(account: Account, _password: string): Promise<Account> { return account; }

  async login(_email: string, _password: string): Promise<Account | null> { return null; }

  async getCurrentAccount(): Promise<Account | null> { return null; }

  async logout(): Promise<void> {}
}
