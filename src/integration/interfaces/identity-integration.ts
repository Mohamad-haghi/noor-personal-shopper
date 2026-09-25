import type { IntegrationProvider } from "./integration-provider";

export interface IdentityIntegration extends IntegrationProvider {
  register(payload: unknown): Promise<unknown>;
  login(payload: unknown): Promise<unknown>;
  logout(): Promise<void>;
  getCurrentIdentity(): Promise<unknown>;
}
