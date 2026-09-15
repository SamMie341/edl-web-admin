import { Disctrict } from "../../../../generated/prisma/client.js";

export const DISTRICT_REPOSITORY = 'DISTRICT_REPOSITORY';

export interface IDistrictRepository {
    findAll(): Promise<Disctrict[]>;
    upsert(id: number, data: any): Promise<Disctrict>;
}