import { Procurement } from "../../../../generated/prisma/client.js";

export const PROCUREMENT_REPOSITORY = 'PROCUREMENT_REPOSITORY';

export interface IProcurementRepository {
    findAll(search?: string, page?: number, limit?: number): Promise<{ data: Procurement[], meta: any }>;
    findById(id: number): Promise<Procurement | null>;
    create(data: any): Promise<Procurement>;
    update(id: number, data: any): Promise<Procurement>;
    delete(id: number): Promise<Procurement>;
}