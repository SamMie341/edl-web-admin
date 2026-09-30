import { Injectable } from '@nestjs/common';
import { IElectricityTariffRepository } from '../../domain/repositories/electricity-tariff.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { ElectricityTariff } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaElectricityTariffRepository implements IElectricityTariffRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string, page: number = 1, limit: number = 10): Promise<{ data: ElectricityTariff[], meta: any }> {
        const skip = (page - 1) * limit;

        const whereCondition = search
            ? { title: { contains: search, mode: 'insensitive' } }
            : undefined;

        const [data, total] = await Promise.all([
            this.prisma.electricityTariff.findMany({
                where: whereCondition as any,
                skip,
                take: limit,
                orderBy: { effectiveDate: 'desc' }, // ລຽງເອົາລາຄາທີ່ປະກາດໃຊ້ລ່າສຸດຂຶ້ນກ່ອນ
            }),
            this.prisma.electricityTariff.count({ where: whereCondition as any }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: { total, page, limit, totalPages },
        };
    }

    async findById(id: number): Promise<ElectricityTariff | null> {
        return this.prisma.electricityTariff.findUnique({ where: { id } });
    }

    async create(data: any): Promise<ElectricityTariff> {
        return this.prisma.electricityTariff.create({ data });
    }

    async update(id: number, data: any): Promise<ElectricityTariff> {
        return this.prisma.electricityTariff.update({ where: { id }, data });
    }

    async delete(id: number): Promise<ElectricityTariff> {
        return this.prisma.electricityTariff.delete({ where: { id } });
    }
}