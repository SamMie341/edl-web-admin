import { JwtPayload } from "../interfaces/jwt-payload.interface.js";

export const ACTIVE_USER_STATUS = 'ACTIVE';

export interface AuthUserProps {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    departmentName: string | null;
    divisionName: string | null;
    unitName: string | null;
    role: string;
    status: string;
}

/**
 * Domain entity ຂອງຜູ້ໃຊ້ໃນບໍລິບົດ Authentication.
 * ບໍ່ຂຶ້ນກັບ Prisma ຫຼື Framework ໃດໆ.
 */
export class AuthUser {
    constructor(private readonly props: AuthUserProps) { }

    get id(): number { return this.props.id; }
    get employeeCode(): string { return this.props.employeeCode; }
    get passwordHash(): string { return this.props.passwordHash; }

    isActive(): boolean {
        return this.props.status === ACTIVE_USER_STATUS;
    }

    /** Payload ທີ່ຈະເຊັນລົງໃນ JWT */
    toJwtPayload(): JwtPayload {
        return {
            sub: this.props.id,
            employeeCode: this.props.employeeCode,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            department: this.props.departmentName,
            division: this.props.divisionName,
            unit: this.props.unitName,
            role: this.props.role,
        };
    }

    /** ຂໍ້ມູນຜູ້ໃຊ້ທີ່ສົ່ງກັບຫຼັງ Login ສຳເລັດ */
    toLoginProfile() {
        return {
            id: this.props.id,
            employeeCode: this.props.employeeCode,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            department: this.props.departmentName,
            division: this.props.divisionName,
            unit: this.props.unitName,
            role: this.props.role,
        };
    }

    /** ຂໍ້ມູນຜູ້ໃຊ້ທີ່ແນບໄວ້ໃນ request (req.user) */
    toRequestUser(): RequestUser {
        return {
            id: this.props.id,
            employeeCode: this.props.employeeCode,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            departmentName: this.props.departmentName,
            divisionName: this.props.divisionName,
            unitName: this.props.unitName,
            role: this.props.role,
        };
    }
}

export interface RequestUser {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    departmentName: string | null;
    divisionName: string | null;
    unitName: string | null;
    role: string;
}
