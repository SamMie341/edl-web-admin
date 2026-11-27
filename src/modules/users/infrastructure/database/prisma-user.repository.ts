import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { User } from "../../../../generated/prisma/client.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

const USER_DETAIL_INCLUDE = {
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

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async delete(id: number): Promise<User> {
        return this.prisma.user.delete({ where: { id } });
    }

    async findAll(): Promise<any[]> {
        return this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: USER_DETAIL_INCLUDE,
        });
    }

    async findById(id: number): Promise<any | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: USER_DETAIL_INCLUDE,
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
