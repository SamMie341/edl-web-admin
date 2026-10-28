export interface JwtPayload {
    sub: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    department: string | null;
    division: string | null;
    unit: string | null;
    role: string;
}
