import type { Branch, BranchId } from "../../domain";

export class DemoBranchProvider implements BranchProvider {
  async listBranches(): Promise<readonly Branch[]> { return []; }

  async getBranch(id: BranchId): Promise<Branch | null> { return null; }
}
