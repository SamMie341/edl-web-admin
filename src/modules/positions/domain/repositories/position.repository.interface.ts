import { Position } from "../../../../generated/prisma/client.js";

export const POSITION_REPOSITORY = 'POSITION_REPOSITORY';

export interface IPositionRepository {
    findAll(search?: string, page?: number, limit?: number): Promise<{ data: Position[], meta: any }>;
    findById(id: number): Promise<Position | null>;
    create(data: any): Promise<Position>;
    update(id: number, data: any): Promise<Position>;
    delete(id: number): Promise<Position>;
}