import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { SavingActionTemplate, TariffCategory } from '../../../../generated/prisma/client.js';
import {
    CategoryWithPresetsAndTemplates,
    IElectricityCalculatorRepository,
    ScheduleWithTiersAndNotice,
} from '../../domain/repositories/electricity-calculator.repository.interface.js';

@Injectable()
export class PrismaElectricityCalculatorRepository implements IElectricityCalculatorRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findActiveCategoriesWithRelations(): Promise<CategoryWithPresetsAndTemplates[]> {
        return this.prisma.applianceCategory.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
            include: {
                presets: {
                    where: { status: 'ACTIVE' },
                    orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
                },
                actionTemplates: {
                    where: { status: 'ACTIVE' },
                    orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
                },
            },
        });
    }

    async findActiveTariffCategories(): Promise<TariffCategory[]> {
        return this.prisma.tariffCategory.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
        });
    }

    async findAvailableSchedulesSummary(): Promise<
        Array<{
            id: number;
            categoryId: number;
            year: number;
            month: number;
            isHotSeason: boolean;
            noticeNumber: string;
        }>
    > {
        const schedules = await this.prisma.tariffSchedule.findMany({
            select: {
                id: true,
                categoryId: true,
                year: true,
                month: true,
                isHotSeason: true,
                notice: {
                    select: {
                        noticeNumber: true,
                    },
                },
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });

        return schedules.map((s) => ({
            id: s.id,
            categoryId: s.categoryId,
            year: s.year,
            month: s.month,
            isHotSeason: s.isHotSeason,
            noticeNumber: s.notice.noticeNumber,
        }));
    }

    async findScheduleByYearMonth(
        year: number,
        month: number,
        categoryId?: number,
    ): Promise<ScheduleWithTiersAndNotice | null> {
        let resolvedCategoryId = categoryId;
        if (!resolvedCategoryId) {
            const firstCategory = await this.prisma.tariffCategory.findFirst({
                where: { status: 'ACTIVE' },
                orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
            });
            resolvedCategoryId = firstCategory?.id ?? 1;
        }

        return this.prisma.tariffSchedule.findUnique({
            where: {
                categoryId_year_month: {
                    categoryId: resolvedCategoryId,
                    year,
                    month,
                },
            },
            include: {
                notice: true,
                category: true,
                tiers: {
                    orderBy: { tierOrder: 'asc' },
                },
            },
        });
    }

    async findLatestActiveSchedule(): Promise<ScheduleWithTiersAndNotice | null> {
        return this.prisma.tariffSchedule.findFirst({
            where: {
                notice: { status: 'ACTIVE' },
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
            include: {
                notice: true,
                category: true,
                tiers: {
                    orderBy: { tierOrder: 'asc' },
                },
            },
        });
    }

    async findActiveSavingTemplates(): Promise<SavingActionTemplate[]> {
        return this.prisma.savingActionTemplate.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
            include: {
                category: {
                    select: { id: true, nameLa: true, nameEn: true },
                },
            },
        }) as any;
    }

    async findSchedulesByYearRange(
        startYear: number,
        endYear: number,
        categoryId?: number,
    ): Promise<ScheduleWithTiersAndNotice[]> {
        let resolvedCategoryId = categoryId;
        if (!resolvedCategoryId) {
            const firstCategory = await this.prisma.tariffCategory.findFirst({
                where: { status: 'ACTIVE' },
                orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
            });
            resolvedCategoryId = firstCategory?.id ?? 1;
        }

        return this.prisma.tariffSchedule.findMany({
            where: {
                categoryId: resolvedCategoryId,
                year: { gte: startYear, lte: endYear },
            },
            orderBy: [{ year: 'asc' }, { month: 'asc' }],
            include: {
                notice: true,
                category: true,
                tiers: {
                    orderBy: { tierOrder: 'asc' },
                },
            },
        });
    }
}
