import type { Branch, BranchId } from "../../domain";

export interface BranchProvider {
  listBranches(): Promise<readonly Branch[]>;
  getBranch(id: BranchId): Promise<Branch | null>;
}
