import type { Visit, VisitId } from "../../domain";

export class DemoVisitProvider implements VisitProvider {
  async getVisit(id: VisitId): Promise<Visit | null> { return null; }

  async requestVisit(visit: Visit): Promise<Visit> { return visit; }

  async cancelVisit(id: VisitId): Promise<Visit | null> { return null; }
}
