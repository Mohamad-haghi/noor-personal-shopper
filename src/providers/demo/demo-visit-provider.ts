import type { VisitProvider } from "../interfaces/visit-provider";
import type { Visit, VisitId } from "../../domain";

export class DemoVisitProvider implements VisitProvider {
  async getVisit(_id: VisitId): Promise<Visit | null> { return null; }

  async requestVisit(visit: Visit): Promise<Visit> { return visit; }

  async cancelVisit(_id: VisitId): Promise<Visit | null> { return null; }
}
