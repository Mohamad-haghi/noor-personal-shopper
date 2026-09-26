import type { VisitProvider } from "../interfaces/visit-provider";
import type { Visit, VisitId } from "../../domain";

export class DemoVisitProvider implements VisitProvider {
  private readonly visits = new Map<string, Visit>();

  async getVisit(id: VisitId): Promise<Visit | null> {
    return this.visits.get(id.id) ?? null;
  }

  async requestVisit(visit: Visit): Promise<Visit> {
    this.visits.set(visit.identity.id, visit);
    return visit;
  }

  async cancelVisit(id: VisitId): Promise<Visit | null> {
    const visit = this.visits.get(id.id);
    if (!visit) return null;
    const cancelled: Visit = { ...visit, status: "cancelled" };
    this.visits.set(id.id, cancelled);
    return cancelled;
  }
}
