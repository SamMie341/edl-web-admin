import { Injectable } from '@nestjs/common';
import { IPositionRepository } from '../../domain/repositories/position.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { Position } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaPositionRepository implements IPositionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string, page: number = 1, limit: number = 10): Promise<{ data: Position[], meta: any }> {
        const skip = (page - 1) * limit;

        const whereCondition = search
            ? { positionName: { contains: search, mode: 'insensitive' } }
            : undefined;

        const [data, total] = await Promise.all([
            this.prisma.position.findMany({
                where: whereCondition as any,
                skip,
                take: limit,
                orderBy: { positionName: 'asc' }, // ລຽງລຳດັບຕາມຊື່ຕຳແໜ່ງ
            }),
            this.prisma.position.count({ where: whereCondition as any }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: { total, page, limit, totalPages },
        };
    }

    async findById(id: number): Promise<Position | null> {
        return this.prisma.position.findUnique({ where: { id } });
    }

    async create(data: any): Promise<Position> {
        return this.prisma.position.create({ data });
    }

    async update(id: number, data: any): Promise<Position> {
        return this.prisma.position.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Position> {
        return this.prisma.position.delete({ where: { id } });
    }
}