import type { ApplicationState, NavigationState, SessionState } from "./application-state";

export interface StateStore {
  getApplicationState(): Promise<ApplicationState | null>;
  setApplicationState(state: ApplicationState): Promise<void>;
  getSessionState(): Promise<SessionState | null>;
  setSessionState(state: SessionState): Promise<void>;
  getNavigationState(): Promise<NavigationState | null>;
  setNavigationState(state: NavigationState): Promise<void>;
  clear(): Promise<void>;
}
