import { Branch } from "../../../../generated/prisma/client.js";


export const BRANCH_REPOSITORY = 'BRANCH_REPOSITORY';

export interface IBranchRepository {
    findAll(): Promise<Branch[]>;
    findById(id: number): Promise<Branch | null>;
    create(data: any): Promise<Branch>;
    update(id: number, data: any): Promise<Branch>;
    delete(id: number): Promise<Branch>;
    upsert(id: number, data: any): Promise<Branch>;
}