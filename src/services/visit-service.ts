import type { VisitProvider } from "../providers/interfaces/visit-provider";
import type { Visit, VisitId } from "../domain";

export class VisitService {
  constructor(private readonly provider: VisitProvider) {}

  getVisit(id: VisitId): Promise<Visit | null> {
    return this.provider.getVisit(id);
  }

  requestVisit(visit: Visit): Promise<Visit> {
    return this.provider.requestVisit(visit);
  }

  cancelVisit(id: VisitId): Promise<Visit | null> {
    return this.provider.cancelVisit(id);
  }
}
