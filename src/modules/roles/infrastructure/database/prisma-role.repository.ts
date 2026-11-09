import { Injectable } from "@nestjs/common";
import { IRoleRepository } from "../../domain/repositories/role.repository.interface.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import { Role } from "../../../../generated/prisma/client.js";

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string, page: number = 1, limit: number = 10): Promise<{ data: any[], meta: any }> {
        const skip = (page - 1) * limit;
        const whereCondition = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } },
            ],
        } : undefined;

        const [roles, total] = await Promise.all([
            this.prisma.role.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: { id: 'asc' },
                include: {
                    _count: {
                        select: {
                            users: true,
                            rolePermissions: true,
                        },
                    },
                    rolePermissions: {
                        select: {
                            permission: {
                                select: {
                                    id: true,
                                    module: true,
                                    action: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.role.count({ where: whereCondition }),
        ]);

        const totalPages = Math.ceil(total / limit);

        const formatted = roles.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            userCount: r._count.users,
            permissionCount: r._count.rolePermissions,
            permissions: r.rolePermissions.map(rp => rp.permission),
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        }));

        return {
            data: formatted,
            meta: { total, page, limit, totalPages },
        };
    }

    async findAllDropdown(): Promise<Partial<Role>[]> {
        return this.prisma.role.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: { id: 'asc' },
        });
    }

    async findById(id: number): Promise<any | null> {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { users: true },
                },
                rolePermissions: {
                    select: {
                        permission: {
                            select: {
                                id: true,
                                module: true,
                                action: true,
                            },
                        },
                    },
                },
            },
        });

        if (!role) return null;

        return {
            id: role.id,
            name: role.name,
            description: role.description,
            userCount: role._count.users,
            permissions: role.rolePermissions.map(rp => rp.permission),
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }

    async findByName(name: string): Promise<Role | null> {
        return this.prisma.role.findUnique({ where: { name } });
    }

    async create(data: { name: string; description?: string }, permissionIds?: number[]): Promise<any> {
        return this.prisma.$transaction(async (tx) => {
            const role = await tx.role.create({
                data: {
                    name: data.name,
                    description: data.description,
                },
            });

            if (permissionIds && permissionIds.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissionIds.map(pId => ({
                        roleId: role.id,
                        permissionId: pId,
                    })),
                });
            }

            const createdRole = await tx.role.findUnique({
                where: { id: role.id },
                include: {
                    _count: { select: { users: true } },
                    rolePermissions: {
                        select: {
                            permission: {
                                select: {
                                    id: true,
                                    module: true,
                                    action: true,
                                },
                            },
                        },
                    },
                },
            });

            return {
                id: createdRole!.id,
                name: createdRole!.name,
                description: createdRole!.description,
                userCount: createdRole!._count.users,
                permissions: createdRole!.rolePermissions.map(rp => rp.permission),
                createdAt: createdRole!.createdAt,
                updatedAt: createdRole!.updatedAt,
            };
        });
    }

    async update(id: number, data: { name?: string; description?: string }, permissionIds?: number[]): Promise<any> {
        return this.prisma.$transaction(async (tx) => {
            await tx.role.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                },
            });

            if (permissionIds !== undefined) {
                await tx.rolePermission.deleteMany({
                    where: { roleId: id },
                });

                if (permissionIds.length > 0) {
                    await tx.rolePermission.createMany({
                        data: permissionIds.map(pId => ({
                            roleId: id,
                            permissionId: pId,
                        })),
                    });
                }
            }

            const updatedRole = await tx.role.findUnique({
                where: { id },
                include: {
                    _count: { select: { users: true } },
                    rolePermissions: {
                        select: {
                            permission: {
                                select: {
                                    id: true,
                                    module: true,
                                    action: true,
                                },
                            },
                        },
                    },
                },
            });

            return {
                id: updatedRole!.id,
                name: updatedRole!.name,
                description: updatedRole!.description,
                userCount: updatedRole!._count.users,
                permissions: updatedRole!.rolePermissions.map(rp => rp.permission),
                createdAt: updatedRole!.createdAt,
                updatedAt: updatedRole!.updatedAt,
            };
        });
    }

    async delete(id: number): Promise<Role> {
        return this.prisma.role.delete({ where: { id } });
    }

    async countUsersByRoleId(roleId: number): Promise<number> {
        return this.prisma.user.count({ where: { roleId } });
    }
}
