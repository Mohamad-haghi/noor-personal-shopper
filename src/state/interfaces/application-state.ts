export interface ApplicationState {
  readonly version: number;
  readonly sessionId: string;
  readonly lastActivity: Date;
}

export interface SessionState {
  readonly isAuthenticated: boolean;
  readonly accountId: string | null;
  readonly shopperProfileId: string | null;
  readonly cartId: string | null;
}

export interface NavigationState {
  readonly currentPath: string;
  readonly previousPath: string | null;
  readonly navigationHistory: readonly string[];
}
