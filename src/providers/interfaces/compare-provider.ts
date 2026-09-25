import type { Comparison, ComparisonId } from "../../domain";

export interface CompareProvider {
  getComparison(id: ComparisonId): Promise<Comparison | null>;
  createComparison(comparison: Comparison): Promise<Comparison>;
  saveComparison(comparison: Comparison): Promise<Comparison>;
}
