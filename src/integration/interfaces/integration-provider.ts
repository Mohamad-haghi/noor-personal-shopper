export interface IntegrationProvider {
  readonly name: string;
  readonly version: string;
  isAvailable(): boolean;
  isConfigured(): boolean;
}

export interface ProductIntegration extends IntegrationProvider {
  fetchProducts(query: ProductQuery): Promise<unknown>;
  fetchProductById(id: string): Promise<unknown>;
}

export interface ProductQuery {
  readonly ids?: readonly string[];
  readonly category?: string;
  readonly brand?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface ShopperIntegration extends IntegrationProvider {
  fetchProfile(accountId: string): Promise<unknown>;
  updatePreferences(accountId: string, preferences: unknown): Promise<void>;
}

export interface OrderIntegration extends IntegrationProvider {
  createOrder(order: unknown): Promise<unknown>;
  fetchOrder(orderId: string): Promise<unknown>;
  updateOrderStatus(orderId: string, status: unknown): Promise<void>;
}

export interface PaymentIntegration extends IntegrationProvider {
  processPayment(payment: unknown): Promise<unknown>;
  verifyPayment(paymentId: string): Promise<unknown>;
}

export interface BranchIntegration extends IntegrationProvider {
  fetchBranches(): Promise<unknown>;
  fetchBranchById(id: string): Promise<unknown>;
  checkAvailability(branchId: string, date: Date): Promise<unknown>;
}
