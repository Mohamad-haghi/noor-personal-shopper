import type { BranchId } from "./branch";
import type { AccountId } from "./account";

export interface VisitId {
  readonly id: string;
}

export interface Visit {
  readonly identity: VisitId;
  readonly branchId: BranchId;
  readonly accountId: AccountId | null;
  readonly scheduledAt: Date;
  readonly duration: VisitDuration;
  readonly purpose: VisitPurpose;
  readonly status: VisitStatus;
  readonly notes: string | null;
  readonly createdAt: Date;
}

export type VisitPurpose = "consultation" | "fitting" | "pickup" | "return" | "exchange" | "other";

export type VisitStatus = 
  | "requested"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface VisitDuration {
  readonly estimatedMinutes: number;
  readonly actualMinutes: number | null;
}
