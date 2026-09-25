import type { ReservationProvider } from "../interfaces/reservation-provider";
import type { Visit, VisitId } from "../../domain";

export class DemoReservationProvider implements ReservationProvider {
  async getReservation(_id: VisitId): Promise<Visit | null> { return null; }
  async requestReservation(visit: Visit): Promise<Visit> { return visit; }
  async cancelReservation(_id: VisitId): Promise<Visit | null> { return null; }
}
