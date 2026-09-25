import type { Comparison, ComparisonId } from "../../domain";

export class DemoCompareProvider implements CompareProvider {
  async getComparison(id: ComparisonId): Promise<Comparison | null> { return null; }

  async createComparison(comparison: Comparison): Promise<Comparison> { return comparison; }

  async saveComparison(comparison: Comparison): Promise<Comparison> { return comparison; }
}
