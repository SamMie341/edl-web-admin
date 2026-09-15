import { User } from "../../../../generated/prisma/client.js";

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmployeeCode(employeeCode: string): Promise<User | null>;
    create(data: any): Promise<User>;
    update(id: number, data: any): Promise<User>;
    delete(id: number): Promise<User>;
}