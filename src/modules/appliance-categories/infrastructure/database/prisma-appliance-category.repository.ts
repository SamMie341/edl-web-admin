import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { ApplianceCategory } from '../../../../generated/prisma/client.js';
import {
    CategoryWithPresetsAndTemplates,
    IApplianceCategoryRepository,
} from '../../domain/repositories/appliance-category.repository.interface.js';
import { CreateApplianceCategoryDto } from '../../application/dtos/create-appliance-category.dto.js';
import { UpdateApplianceCategoryDto } from '../../application/dtos/update-appliance-category.dto.js';

@Injectable()
export class PrismaApplianceCategoryRepository implements IApplianceCategoryRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string): Promise<CategoryWithPresetsAndTemplates[]> {
        return this.prisma.applianceCategory.findMany({
            where: search
                ? {
                    OR: [
                        { nameLa: { contains: search, mode: 'insensitive' } },
                        { nameEn: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
            include: {
                presets: {
                    orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
                },
                actionTemplates: {
                    orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
                },
            },
        });
    }

    async findById(id: number): Promise<CategoryWithPresetsAndTemplates | null> {
        return this.prisma.applianceCategory.findUnique({
            where: { id },
            include: {
                presets: {
                    orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
                },
                actionTemplates: {
                    orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
                },
            },
        });
    }

    async create(data: CreateApplianceCategoryDto): Promise<ApplianceCategory> {
        return this.prisma.applianceCategory.create({ data });
    }

    async update(id: number, data: UpdateApplianceCategoryDto): Promise<ApplianceCategory> {
        return this.prisma.applianceCategory.update({ where: { id }, data });
    }

    async delete(id: number): Promise<ApplianceCategory> {
        return this.prisma.applianceCategory.delete({ where: { id } });
    }
}
