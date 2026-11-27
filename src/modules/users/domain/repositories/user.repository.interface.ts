export const USER_REPOSITORY = 'USER_REPOSITORY';

export type SafeUser = Record<string, any>;

export interface UserPasswordChangeRecord {
    id: number;
    employeeCode: string;
    passwordHash: string;
    mustChangePassword: boolean;
    role: { name: string } | null;
}

export interface IUserRepository {
    findAll(): Promise<SafeUser[]>;
    findById(id: number): Promise<SafeUser | null>;
    findByEmployeeCode(employeeCode: string): Promise<SafeUser | null>;
    findForPasswordChange(identifier: number): Promise<UserPasswordChangeRecord | null>;
    create(data: any): Promise<SafeUser>;
    update(id: number, data: any): Promise<SafeUser>;
    delete(id: number): Promise<SafeUser>;
}
