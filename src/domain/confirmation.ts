import type { OrderId } from "./order";

export interface ConfirmationId {
  readonly id: string;
}

export interface Confirmation {
  readonly identity: ConfirmationId;
  readonly orderId: OrderId;
  readonly requestIdentity: RequestIdentity;
  readonly status: ConfirmationStatus;
  readonly sentAt: Date;
  readonly confirmedAt: Date | null;
}

export interface RequestIdentity {
  readonly requestToken: string;
  readonly ipAddress: string | null;
  readonly userAgent: string | null;
  readonly fingerprint: string | null;
}

export type ConfirmationStatus = "pending" | "confirmed" | "expired" | "cancelled";
