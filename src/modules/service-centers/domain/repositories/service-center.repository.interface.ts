import { ServiceCenter } from "../../../../generated/prisma/client.js";

export const SERVICE_CENTER_REPOSITORY = 'SERVICE_CENTER_REPOSITORY';

export interface IServiceCenterRepository {
    findAll(provinceId?: number, page?: number, limit?: number): Promise<{ data: ServiceCenter[], meta: any }>;
    findById(id: number): Promise<ServiceCenter | null>;
    create(data: any): Promise<ServiceCenter>;
    update(id: number, data: any): Promise<ServiceCenter>;
    delete(id: number): Promise<ServiceCenter>;
    upsert(id: number, data: any): Promise<ServiceCenter>;
}
