import type { IdentityProvider } from "../interfaces/identity-provider";
import type { Account } from "../../domain";

export class DemoIdentityProvider implements IdentityProvider {
  async register(account: Account, _password: string): Promise<Account> { return account; }
  async login(_email: string, _password: string): Promise<Account | null> { return null; }
  async getCurrentIdentity(): Promise<Account | null> { return null; }
  async logout(): Promise<void> {}
}
