import type { BranchProvider } from "../providers/interfaces/branch-provider";
import type { Branch, BranchId } from "../../domain";

export class BranchService {
  constructor(private readonly provider: BranchProvider) {}

  listBranches(): Promise<readonly Branch[]> {
    return this.provider.listBranches();
  }

  getBranch(id: BranchId): Promise<Branch | null> {
    return this.provider.getBranch(id);
  }
}
