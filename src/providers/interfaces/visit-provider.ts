import type { Visit, VisitId } from "../../domain";

export interface VisitProvider {
  getVisit(id: VisitId): Promise<Visit | null>;
  requestVisit(visit: Visit): Promise<Visit>;
  cancelVisit(id: VisitId): Promise<Visit | null>;
}
