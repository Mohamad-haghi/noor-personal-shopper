import type { IntegrationProvider } from "./integration-provider";

export interface ReservationIntegration extends IntegrationProvider {
  createReservation(payload: unknown): Promise<unknown>;
  getReservation(id: string): Promise<unknown>;
  cancelReservation(id: string): Promise<unknown>;
}
