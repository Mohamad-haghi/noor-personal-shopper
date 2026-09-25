import type { AccountProvider } from "../providers/interfaces/account-provider";
import type { Account, AccountId } from "../../domain";

export class AccountService {
  constructor(private readonly provider: AccountProvider) {}

  getAccount(id: AccountId): Promise<Account | null> {
    return this.provider.getAccount(id);
  }

  register(account: Account, password: string): Promise<Account> {
    return this.provider.register(account, password);
  }

  login(email: string, password: string): Promise<Account | null> {
    return this.provider.login(email, password);
  }

  getCurrentAccount(): Promise<Account | null> {
    return this.provider.getCurrentAccount();
  }

  logout(): Promise<void> {
    return this.provider.logout();
  }
}
