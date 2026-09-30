import { Legislation } from "../../entities/legislation.entity.js";


export const LEGISLATION_REPOSITORY = 'LEGISLATION_REPOSITORY';

export interface ILegislationRepository {
    findAll(search?: string, page?: number, limit?: number): Promise<{ data: Legislation[], meta: any }>;
    findById(id: number): Promise<Legislation | null>;
    create(data: any): Promise<Legislation>;
    update(id: number, data: any): Promise<Legislation>;
    delete(id: number): Promise<Legislation>;
}