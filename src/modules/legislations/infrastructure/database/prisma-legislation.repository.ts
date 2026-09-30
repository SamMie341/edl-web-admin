import { Injectable } from '@nestjs/common';
import { ILegislationRepository } from '../../domain/repositories/legislation.repository.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { Legislation } from '../../entities/legislation.entity.js';

@Injectable()
export class PrismaLegislationRepository implements ILegislationRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string, page: number = 1, limit: number = 10): Promise<{ data: Legislation[], meta: any }> {
        const skip = (page - 1) * limit;
        const whereCondition = search ? {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { documentNumber: { contains: search, mode: 'insensitive' } },
            ]
        } : undefined;
        const [data, total] = await Promise.all([
            this.prisma.legislation.findMany({
                where: whereCondition as any,
                skip,
                take: limit,
                orderBy: { issueDate: 'desc' },
            }),
            this.prisma.legislation.count({ where: whereCondition as any }),
        ]);

        const totalPages = Math.ceil(total / limit);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            }
        };
    }

    async findById(id: number): Promise<Legislation | null> {
        return this.prisma.legislation.findUnique({ where: { id } });
    }

    async create(data: any): Promise<Legislation> {
        return this.prisma.legislation.create({ data });
    }

    async update(id: number, data: any): Promise<Legislation> {
        return this.prisma.legislation.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Legislation> {
        return this.prisma.legislation.delete({ where: { id } });
    }
}