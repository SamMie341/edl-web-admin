import { Injectable, BadRequestException } from '@nestjs/common';
import { IProcurementRepository } from '../../domain/repositories/procurement.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { Procurement } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaProcurementRepository implements IProcurementRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string, page: number = 1, limit: number = 10): Promise<{ data: Procurement[], meta: any }> {
        const skip = (page - 1) * limit;

        const whereCondition = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { tenderNumber: { contains: search, mode: 'insensitive' } },
                ],
            }
            : undefined;

        const [data, total] = await Promise.all([
            this.prisma.procurement.findMany({
                where: whereCondition as any,
                skip,
                take: limit,
                orderBy: { startDate: 'desc' }, // ລຽງເອົາໂຄງການໃໝ່ຂຶ້ນກ່ອນ
            }),
            this.prisma.procurement.count({ where: whereCondition as any }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: { total, page, limit, totalPages },
        };
    }

    async findById(id: number): Promise<Procurement | null> {
        return this.prisma.procurement.findUnique({ where: { id } });
    }

    async create(data: any): Promise<Procurement> {
        try {
            return await this.prisma.procurement.create({ data });
        } catch (error: any) {
            if (error.code === 'P2002') { // Handle Unique constraint ຂອງ tenderNumber
                throw new BadRequestException('ເລກທີປະກວດລາຄານີ້ມີໃນລະບົບແລ້ວ');
            }
            throw error;
        }
    }

    async update(id: number, data: any): Promise<Procurement> {
        try {
            return await this.prisma.procurement.update({ where: { id }, data });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new BadRequestException('ເລກທີປະກວດລາຄານີ້ມີໃນລະບົບແລ້ວ');
            }
            throw error;
        }
    }

    async delete(id: number): Promise<Procurement> {
        return this.prisma.procurement.delete({ where: { id } });
    }
}