import type { IdentityProvider } from "../providers/interfaces/identity-provider";
import type { Account } from "../domain";

export class IdentityService {
  constructor(private readonly provider: IdentityProvider) {}

  register(account: Account, password: string): Promise<Account> { return this.provider.register(account, password); }
  login(email: string, password: string): Promise<Account | null> { return this.provider.login(email, password); }
  getCurrentIdentity(): Promise<Account | null> { return this.provider.getCurrentIdentity(); }
  logout(): Promise<void> { return this.provider.logout(); }
}
