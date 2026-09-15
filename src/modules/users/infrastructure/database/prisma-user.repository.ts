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
    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } })
    }
    async findByEmployeeCode(employeeCode: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { employeeCode } });
    }
    async create(data: any): Promise<User> {
        return this.prisma.user.create({ data });
    }
    async update(id: number, data: any): Promise<User> {
        return this.prisma.user.update({ where: { id }, data });
    }
}