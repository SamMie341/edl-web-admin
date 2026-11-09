import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { User } from "../../../../generated/prisma/client.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async delete(id: number): Promise<User> {
        return this.prisma.user.delete({ where: { id } });
    }

    async findAll(): Promise<any[]> {
        return this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
                userPermissions: {
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
    }

    async findById(id: number): Promise<any | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
                userPermissions: {
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
    }

    async findByEmployeeCode(employeeCode: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { employeeCode },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
    }

    async create(data: any): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async update(id: number, data: any): Promise<User> {
        return this.prisma.user.update({ where: { id }, data });
    }
}
