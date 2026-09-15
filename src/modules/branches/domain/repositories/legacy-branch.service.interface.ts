export const LEGACY_BRANCH_SERVICE = 'LEGACY_BRANCH_SERVICE';

export interface ILegacyBranchService {
    fetchBranches(): Promise<any[]>;
    downlaodImage(url: string, fileName: string): Promise<string | null>;
}