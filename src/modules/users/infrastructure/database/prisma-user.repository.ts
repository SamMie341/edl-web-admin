import { Injectable } from "@nestjs/common";
import {
    IUserRepository,
    SafeUser,
    UserPasswordChangeRecord,
} from "../../domain/repositories/user.repository.interface.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

/** Safe scalar fields for User responses; intentionally excludes `passwordHash`. */
export const USER_SAFE_SELECT = {
    id: true,
    employeeCode: true,
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    departmentId: true,
    departmentName: true,
    divisionName: true,
    unitName: true,
    roleId: true,
    status: true,
    mustChangePassword: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
} as const;

const USER_DETAIL_SELECT = {
    ...USER_SAFE_SELECT,
    role: {
        select: {
            id: true,
            name: true,
            description: true,
        },
    },
    userPermissions: {
        select: {
            effect: true,
            permission: {
                select: {
                    id: true,
                    module: true,
                    action: true,
                },
            },
        },
    },
} as const;

const USER_WITH_ROLE_SELECT = {
    ...USER_SAFE_SELECT,
    role: {
        select: {
            id: true,
            name: true,
            description: true,
        },
    },
} as const;

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async delete(id: number): Promise<SafeUser> {
        return this.prisma.user.delete({
            where: { id },
            select: USER_SAFE_SELECT,
        });
    }

    async findAll(): Promise<SafeUser[]> {
        return this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: USER_DETAIL_SELECT,
        });
    }

    async findById(id: number): Promise<SafeUser | null> {
        return this.prisma.user.findUnique({
            where: { id },
            select: USER_DETAIL_SELECT,
        });
    }

    async findByEmployeeCode(employeeCode: string): Promise<SafeUser | null> {
        return this.prisma.user.findUnique({
            where: { employeeCode },
            select: USER_WITH_ROLE_SELECT,
        });
    }

    async findForPasswordChange(identifier: number): Promise<UserPasswordChangeRecord | null> {
        const select = {
            id: true,
            employeeCode: true,
            passwordHash: true,
            mustChangePassword: true,
            role: {
                select: {
                    name: true,
                },
            },
        } as const;

        const byId = await this.prisma.user.findUnique({
            where: { id: identifier },
            select,
        });
        if (byId) {
            return byId;
        }

        return this.prisma.user.findUnique({
            where: { employeeCode: identifier.toString() },
            select,
        });
    }

    async create(data: any): Promise<SafeUser> {
        return this.prisma.user.create({
            data,
            select: USER_WITH_ROLE_SELECT,
        });
    }

    async update(id: number, data: any): Promise<SafeUser> {
        return this.prisma.user.update({
            where: { id },
            data,
            select: USER_WITH_ROLE_SELECT,
        });
    }
}
