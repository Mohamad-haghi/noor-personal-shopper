export interface ShopperProfileId {
  readonly id: string;
}

export interface ShopperProfile {
  readonly identity: ShopperProfileId;
  readonly preferences: ShopperPreferences;
  readonly styleProfile: StyleProfile;
  readonly measurementProfile: MeasurementProfile | null;
  readonly budgetProfile: BudgetProfile | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ShopperPreferences {
  readonly preferredCategories: readonly string[];
  readonly excludedCategories: readonly string[];
  readonly preferredBrands: readonly string[];
  readonly excludedBrands: readonly string[];
  readonly colorPreferences: readonly string[];
  readonly sizePreferences: readonly string[];
  readonly notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  readonly emailNotifications: boolean;
  readonly smsNotifications: boolean;
  readonly pushNotifications: boolean;
  readonly marketingEmails: boolean;
}

export interface StyleProfile {
  readonly styleTypes: readonly string[];
  readonly occasionPreferences: readonly string[];
  readonly formalityPreference: FormalityLevel | null;
}

export type FormalityLevel = "casual" | "smart_casual" | "formal" | "very_formal";

export interface MeasurementProfile {
  readonly height: number | null;
  readonly weight: number | null;
  readonly measurements: Readonly<Record<string, number>>;
  readonly unit: MeasurementUnit;
}

export type MeasurementUnit = "metric" | "imperial";

export interface BudgetProfile {
  readonly minBudget: number | null;
  readonly maxBudget: number | null;
  readonly currency: string;
  readonly priceRangePreference: PriceRangePreference;
}

export type PriceRangePreference = "budget" | "mid_range" | "premium" | "luxury" | "no_preference";
