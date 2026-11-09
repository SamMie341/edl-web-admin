import { Role } from "../../../../generated/prisma/client.js";

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface IRoleRepository {
    findAll(search?: string, page?: number, limit?: number): Promise<{ data: any[], meta: any }>;
    findAllDropdown(): Promise<Partial<Role>[]>;
    findById(id: number): Promise<any | null>;
    findByName(name: string): Promise<Role | null>;
    create(data: { name: string; description?: string }, permissionIds?: number[]): Promise<any>;
    update(id: number, data: { name?: string; description?: string }, permissionIds?: number[]): Promise<any>;
    delete(id: number): Promise<Role>;
    countUsersByRoleId(roleId: number): Promise<number>;
}
