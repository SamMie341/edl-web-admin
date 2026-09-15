import { Injectable } from '@nestjs/common';
import { IDepartmentRepository } from '../../domain/repositories/department.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { Department } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaDepartmentRepository implements IDepartmentRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Department[]> {
        return this.prisma.department.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: number): Promise<Department | null> {
        return this.prisma.department.findUnique({
            where: { id },
        });
    }

    async create(data: { name: string }): Promise<Department> {
        return this.prisma.department.create({ data });
    }

    async update(id: number, data: { name?: string }): Promise<Department> {
        return this.prisma.department.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Department> {
        return this.prisma.department.delete({
            where: { id },
        });
    }
}