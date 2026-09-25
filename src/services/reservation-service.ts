import type { Visit, VisitId } from "../domain";
import type { ReservationProvider } from "../providers/interfaces/reservation-provider";

export class ReservationService {
  constructor(private readonly provider: ReservationProvider) {}

  get(id: VisitId): Promise<Visit | null> { return this.provider.getReservation(id); }
  request(visit: Visit): Promise<Visit> { return this.provider.requestReservation(visit); }
  cancel(id: VisitId): Promise<Visit | null> { return this.provider.cancelReservation(id); }
}
