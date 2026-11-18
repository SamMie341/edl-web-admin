import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { SavingActionTemplate } from '../../../../generated/prisma/client.js';
import { CreateSavingTemplateDto } from '../../application/dtos/create-saving-template.dto.js';
import { UpdateSavingTemplateDto } from '../../application/dtos/update-saving-template.dto.js';
import { ISavingTemplateRepository } from '../../domain/repositories/saving-template.repository.interface.js';

@Injectable()
export class PrismaSavingTemplateRepository implements ISavingTemplateRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(categoryId?: number, search?: string): Promise<SavingActionTemplate[]> {
        return this.prisma.savingActionTemplate.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(search && {
                    OR: [
                        { titleLa: { contains: search, mode: 'insensitive' } },
                        { titleEn: { contains: search, mode: 'insensitive' } },
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

    async findById(id: number): Promise<SavingActionTemplate | null> {
        return this.prisma.savingActionTemplate.findUnique({
            where: { id },
            include: {
                category: {
                    select: { id: true, nameLa: true, nameEn: true },
                },
            },
        });
    }

    async create(data: CreateSavingTemplateDto): Promise<SavingActionTemplate> {
        return this.prisma.savingActionTemplate.create({ data: data as any });
    }

    async update(id: number, data: UpdateSavingTemplateDto): Promise<SavingActionTemplate> {
        return this.prisma.savingActionTemplate.update({ where: { id }, data: data as any });
    }

    async delete(id: number): Promise<SavingActionTemplate> {
        return this.prisma.savingActionTemplate.delete({ where: { id } });
    }
}
