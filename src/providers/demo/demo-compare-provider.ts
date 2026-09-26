import type { CompareProvider } from "../interfaces/compare-provider";
import type { Comparison, ComparisonId } from "../../domain";

export class DemoCompareProvider implements CompareProvider {
  private readonly comparisons = new Map<string, Comparison>();

  async getComparison(id: ComparisonId): Promise<Comparison | null> {
    return this.comparisons.get(id.id) ?? null;
  }

  async createComparison(comparison: Comparison): Promise<Comparison> {
    this.comparisons.set(comparison.identity.id, comparison);
    return comparison;
  }

  async saveComparison(comparison: Comparison): Promise<Comparison> {
    this.comparisons.set(comparison.identity.id, comparison);
    return comparison;
  }
}
