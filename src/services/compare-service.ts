import type { CompareProvider } from "../providers/interfaces/compare-provider";
import type { Comparison, ComparisonId } from "../domain";

export class CompareService {
  constructor(private readonly provider: CompareProvider) {}

  getComparison(id: ComparisonId): Promise<Comparison | null> {
    return this.provider.getComparison(id);
  }

  createComparison(comparison: Comparison): Promise<Comparison> {
    return this.provider.createComparison(comparison);
  }

  saveComparison(comparison: Comparison): Promise<Comparison> {
    return this.provider.saveComparison(comparison);
  }
}
