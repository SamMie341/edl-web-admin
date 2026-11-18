import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { AppliancePreset } from '../../../../generated/prisma/client.js';
import { IAppliancePresetRepository } from '../../domain/repositories/appliance-preset.repository.interface.js';
import { CreateAppliancePresetDto } from '../../application/dtos/create-appliance-preset.dto.js';
import { UpdateAppliancePresetDto } from '../../application/dtos/update-appliance-preset.dto.js';

@Injectable()
export class PrismaAppliancePresetRepository implements IAppliancePresetRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(categoryId?: number, search?: string): Promise<AppliancePreset[]> {
        return this.prisma.appliancePreset.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(search && {
                    OR: [
                        { nameLa: { contains: search, mode: 'insensitive' } },
                        { nameEn: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
            include: {
                category: {
                    select: { id: true, nameLa: true, nameEn: true },
                },
            },
        });
    }

    async findById(id: number): Promise<AppliancePreset | null> {
        return this.prisma.appliancePreset.findUnique({
            where: { id },
            include: {
                category: {
                    select: { id: true, nameLa: true, nameEn: true },
                },
            },
        });
    }

    async create(data: CreateAppliancePresetDto): Promise<AppliancePreset> {
        return this.prisma.appliancePreset.create({ data });
    }

    async update(id: number, data: UpdateAppliancePresetDto): Promise<AppliancePreset> {
        return this.prisma.appliancePreset.update({ where: { id }, data });
    }

    async delete(id: number): Promise<AppliancePreset> {
        return this.prisma.appliancePreset.delete({ where: { id } });
    }
}
