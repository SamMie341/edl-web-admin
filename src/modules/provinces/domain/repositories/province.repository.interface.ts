import { Province } from "../../../../generated/prisma/client.js";

export const PROVINCE_REPOSITORY = 'PROVINCE_REPOSITORY';

export interface IProvinceRepository {
    findAll(): Promise<Province[]>
    upsert(id: number, data: any): Promise<Province>;
}