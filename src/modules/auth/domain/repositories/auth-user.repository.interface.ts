import { AuthUser } from "../entities/auth-user.entity.js";

export const AUTH_USER_REPOSITORY = 'AUTH_USER_REPOSITORY';

export interface IAuthUserRepository {
    findByEmployeeCode(employeeCode: string): Promise<AuthUser | null>;
    findById(id: number): Promise<AuthUser | null>;
    updateLastLogin(id: number, date: Date): Promise<void>;
}
