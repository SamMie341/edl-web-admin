import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import { AuthUser } from "../../domain/entities/auth-user.entity.js";
import { IAuthUserRepository } from "../../domain/repositories/auth-user.repository.interface.js";

@Injectable()
export class PrismaAuthUserRepository implements IAuthUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmployeeCode(employeeCode: string): Promise<AuthUser | null> {
        const user = await this.prisma.user.findUnique({
            where: { employeeCode },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            select: {
                                permission: {
                                    select: {
                                        module: true,
                                        action: true,
                                    },
                                },
                            },
                        },
                    },
                },
                userPermissions: {
                    select: {
                        permission: {
                            select: {
                                module: true,
                                action: true,
                            },
                        },
                    },
                },
            },
        });
        return user ? this.toDomain(user) : null;
    }

    async findById(id: number): Promise<AuthUser | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            select: {
                                permission: {
                                    select: {
                                        module: true,
                                        action: true,
                                    },
                                },
                            },
                        },
                    },
                },
                userPermissions: {
                    select: {
                        permission: {
                            select: {
                                module: true,
                                action: true,
                            },
                        },
                    },
                },
            },
        });
        return user ? this.toDomain(user) : null;
    }

    async updateLastLogin(id: number, date: Date): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { lastLoginAt: date },
        });
    }

    private toDomain(user: any): AuthUser {
        const rolePermissions = user.role?.rolePermissions?.map((rp: any) => ({
            module: rp.permission.module,
            action: rp.permission.action,
        })) || [];

        const userPermissions = user.userPermissions?.map((up: any) => ({
            module: up.permission.module,
            action: up.permission.action,
        })) || [];

        const permMap = new Map<string, { module: string; action: string }>();
        for (const p of [...rolePermissions, ...userPermissions]) {
            permMap.set(`${p.module}:${p.action}`, p);
        }

        return new AuthUser({
            id: user.id,
            employeeCode: user.employeeCode,
            firstName: user.firstName,
            lastName: user.lastName,
            passwordHash: user.passwordHash,
            departmentName: user.departmentName,
            divisionName: user.divisionName,
            unitName: user.unitName,
            role: user.role?.name || 'STAFF',
            status: user.status,
            permissions: Array.from(permMap.values()),
        });
    }
}
