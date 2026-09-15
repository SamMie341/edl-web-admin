import { Department } from "../../../../generated/prisma/client.js";


export const DEPARTMENT_REPOSITORY = 'DEPARTMENT_REPOSITORY';

export interface IDepartmentRepository {
    findAll(): Promise<Department[]>;
    findById(id: number): Promise<Department | null>;
    create(data: { name: string }): Promise<Department>;
    update(id: number, data: { name?: string }): Promise<Department>;
    delete(id: number): Promise<Department>;
}