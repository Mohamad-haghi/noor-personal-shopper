import type { Account } from "../../domain";

export interface IdentityProvider {
  register(account: Account, password: string): Promise<Account>;
  login(email: string, password: string): Promise<Account | null>;
  getCurrentIdentity(): Promise<Account | null>;
  logout(): Promise<void>;
}
