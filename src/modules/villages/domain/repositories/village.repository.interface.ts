import { Village } from "../../../../generated/prisma/client.js";

export const VILLAGE_REPOSITORY = 'VILLAGE_REPOSITORY';

export interface IVillageRepository {
    findAll(districtId?: number): Promise<Village[]>;
    upsert(id: number, data: any): Promise<Village>;
}