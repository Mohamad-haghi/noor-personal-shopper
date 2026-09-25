import type { Visit, VisitId } from "../../domain";

export interface ReservationProvider {
  getReservation(id: VisitId): Promise<Visit | null>;
  requestReservation(visit: Visit): Promise<Visit>;
  cancelReservation(id: VisitId): Promise<Visit | null>;
}
