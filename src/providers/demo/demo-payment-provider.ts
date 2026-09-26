import type { PaymentProvider } from "../interfaces/payment-provider";
import type { Payment, PaymentId, OrderId } from "../../domain";

export interface DemoPaymentPolicy {
  readonly failureToken: string;
}

const DEFAULT_POLICY: DemoPaymentPolicy = Object.freeze({
  failureToken: "demo_failure",
});

export class DemoPaymentProvider implements PaymentProvider {
  private readonly payments = new Map<string, Payment>();

  constructor(private readonly policy: DemoPaymentPolicy = DEFAULT_POLICY) {}

  async getPayment(id: PaymentId): Promise<Payment | null> {
    return this.payments.get(id.id) ?? null;
  }

  async createPayment(payment: Payment): Promise<Payment> {
    const now = new Date();
    const shouldFail = payment.transaction?.failureReason === this.policy.failureToken;
    const processed: Payment = shouldFail
      ? {
          ...payment,
          status: "failed",
          transaction: {
            providerTransactionId: "demo-txn-" + payment.identity.id,
            authorizationCode: null,
            capturedAt: null,
            failureReason: "پرداخت Demo عمداً ناموفق شبیه‌سازی شد.",
          },
          updatedAt: now,
        }
      : {
          ...payment,
          status: "captured",
          transaction: {
            providerTransactionId: "demo-txn-" + payment.identity.id,
            authorizationCode: "DEMO-AUTH-" + payment.identity.id,
            capturedAt: now,
            failureReason: null,
          },
          updatedAt: now,
        };

    this.payments.set(processed.identity.id, processed);
    return processed;
  }

  async listPayments(orderId: OrderId): Promise<readonly Payment[]> {
    return [...this.payments.values()].filter((payment) => payment.orderId.id === orderId.id);
  }
}
