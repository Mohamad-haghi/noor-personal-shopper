export interface BranchId {
  readonly id: string;
}

export interface Branch {
  readonly identity: BranchId;
  readonly name: string;
  readonly code: string;
  readonly location: BranchLocation;
  readonly contact: BranchContact;
  readonly operatingHours: readonly OperatingHours[];
  readonly services: readonly BranchService[];
  readonly status: BranchStatus;
}

export interface BranchLocation {
  readonly address: string;
  readonly city: string;
  readonly region: string;
  readonly country: string;
  readonly postalCode: string | null;
  readonly coordinates: GeographicCoordinates | null;
}

export interface GeographicCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface BranchContact {
  readonly phone: string | null;
  readonly email: string | null;
  readonly website: string | null;
}

export interface OperatingHours {
  readonly dayOfWeek: DayOfWeek;
  readonly openTime: string;
  readonly closeTime: string;
  readonly isClosed: boolean;
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type BranchService = "fitting" | "consultation" | "pickup" | "returns" | "alterations";

export type BranchStatus = "open" | "closed" | "temporarily_closed" | "coming_soon";
