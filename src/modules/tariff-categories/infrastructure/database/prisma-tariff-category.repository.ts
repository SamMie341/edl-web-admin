import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { TariffCategory } from '../../../../generated/prisma/client.js';
import { CreateTariffCategoryDto } from '../../application/dtos/create-tariff-category.dto.js';
import { UpdateTariffCategoryDto } from '../../application/dtos/update-tariff-category.dto.js';
import { ITariffCategoryRepository } from '../../domain/repositories/tariff-category.repository.interface.js';

@Injectable()
export class PrismaTariffCategoryRepository implements ITariffCategoryRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<TariffCategory[]> {
        return this.prisma.tariffCategory.findMany({
            orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
        });
    }

    async findById(id: number): Promise<TariffCategory | null> {
        return this.prisma.tariffCategory.findUnique({
            where: { id },
        });
    }

    async create(data: CreateTariffCategoryDto): Promise<TariffCategory> {
        return this.prisma.tariffCategory.create({
            data: {
                nameLa: data.nameLa,
                nameEn: data.nameEn,
                categoryGroup: data.categoryGroup,
                voltageLevel: data.voltageLevel,
                description: data.description,
                orderIndex: data.orderIndex ?? 0,
                status: (data.status as any) ?? 'ACTIVE',
            },
        });
    }

    async update(id: number, data: UpdateTariffCategoryDto): Promise<TariffCategory> {
        await this.ensureExists(id);
        return this.prisma.tariffCategory.update({
            where: { id },
            data: {
                ...(data.nameLa && { nameLa: data.nameLa }),
                ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
                ...(data.categoryGroup !== undefined && { categoryGroup: data.categoryGroup }),
                ...(data.voltageLevel !== undefined && { voltageLevel: data.voltageLevel }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
                ...(data.status && { status: data.status as any }),
            },
        });
    }

    async delete(id: number): Promise<TariffCategory> {
        await this.ensureExists(id);
        return this.prisma.tariffCategory.delete({
            where: { id },
        });
    }

    private async ensureExists(id: number) {
        const item = await this.findById(id);
        if (!item) {
            throw new NotFoundException(`Tariff category ID ${id} not found`);
        }
        return item;
    }
}
