import type { AccountProvider } from "../interfaces/account-provider";
import type { Account, AccountId } from "../../domain";

interface DemoCredential {
  readonly account: Account;
  readonly password: string;
}

export class DemoAccountProvider implements AccountProvider {
  private readonly credentials = new Map<string, DemoCredential>();
  private currentEmail: string | null = null;

  async getAccount(id: AccountId): Promise<Account | null> {
    return [...this.credentials.values()].find(({ account }) => account.identity.id === id.id)?.account ?? null;
  }

  async register(account: Account, password: string): Promise<Account> {
    const email = account.email.trim().toLowerCase();
    if (!email || !password) throw new Error("اطلاعات ثبت‌نام کامل نیست.");
    if (this.credentials.has(email)) throw new Error("این ایمیل قبلاً در Demo ثبت شده است.");

    const normalizedAccount: Account = { ...account, email };
    this.credentials.set(email, { account: normalizedAccount, password });
    this.currentEmail = email;
    return normalizedAccount;
  }

  async login(email: string, password: string): Promise<Account | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const credential = this.credentials.get(normalizedEmail);
    if (!credential || credential.password !== password) return null;

    this.currentEmail = normalizedEmail;
    return credential.account;
  }

  async getCurrentAccount(): Promise<Account | null> {
    if (!this.currentEmail) return null;
    return this.credentials.get(this.currentEmail)?.account ?? null;
  }

  async logout(): Promise<void> {
    this.currentEmail = null;
  }
}
