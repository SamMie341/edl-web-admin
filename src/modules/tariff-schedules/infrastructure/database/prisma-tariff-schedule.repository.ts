import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { TariffNotice, TariffSchedule } from '../../../../generated/prisma/client.js';
import { CreateTariffNoticeDto } from '../../application/dtos/create-tariff-notice.dto.js';
import { UpdateTariffNoticeDto } from '../../application/dtos/update-tariff-notice.dto.js';
import { UpsertTariffScheduleDto } from '../../application/dtos/upsert-tariff-schedule.dto.js';
import {
    ITariffScheduleRepository,
    ScheduleWithTiersAndNotice,
} from '../../domain/repositories/tariff-schedule.repository.interface.js';

@Injectable()
export class PrismaTariffScheduleRepository implements ITariffScheduleRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAllNotices(): Promise<TariffNotice[]> {
        return this.prisma.tariffNotice.findMany({
            orderBy: [{ effectiveFrom: 'desc' }, { id: 'desc' }],
        });
    }

    async findNoticeById(id: number): Promise<TariffNotice | null> {
        return this.prisma.tariffNotice.findUnique({
            where: { id },
            include: {
                schedules: {
                    include: {
                        category: true,
                        tiers: { orderBy: { tierOrder: 'asc' } },
                    },
                    orderBy: [{ year: 'asc' }, { month: 'asc' }],
                },
            },
        });
    }

    async createNotice(data: CreateTariffNoticeDto): Promise<TariffNotice> {
        return this.prisma.tariffNotice.create({
            data: {
                noticeNumber: data.noticeNumber,
                title: data.title,
                issuedDate: new Date(data.issuedDate),
                effectiveFrom: new Date(data.effectiveFrom),
                effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : new Date('2099-12-31'),
                vatRate: data.vatRate ?? 0.1,
                hotSeasonDiscountCapKwh: data.hotSeasonDiscountCapKwh ?? 300,
                maintenanceFeeKip: data.maintenanceFeeKip ?? 0,
                status: (data.status as any) ?? 'ACTIVE',
            },
        });
    }

    async updateNotice(id: number, data: UpdateTariffNoticeDto): Promise<TariffNotice> {
        return this.prisma.tariffNotice.update({
            where: { id },
            data: {
                ...(data.noticeNumber && { noticeNumber: data.noticeNumber }),
                ...(data.title && { title: data.title }),
                ...(data.issuedDate && { issuedDate: new Date(data.issuedDate) }),
                ...(data.effectiveFrom && { effectiveFrom: new Date(data.effectiveFrom) }),
                ...(data.effectiveTo && {
                    effectiveTo: new Date(data.effectiveTo),
                }),
                ...(data.vatRate !== undefined && { vatRate: data.vatRate }),
                ...(data.hotSeasonDiscountCapKwh !== undefined && {
                    hotSeasonDiscountCapKwh: data.hotSeasonDiscountCapKwh,
                }),
                ...(data.maintenanceFeeKip !== undefined && {
                    maintenanceFeeKip: data.maintenanceFeeKip,
                }),
                ...(data.status && { status: data.status as any }),
            },
        });
    }

    async deleteNotice(id: number): Promise<TariffNotice> {
        return this.prisma.tariffNotice.delete({ where: { id } });
    }

    async upsertScheduleWithTiers(data: UpsertTariffScheduleDto): Promise<ScheduleWithTiersAndNotice> {
        return this.prisma.$transaction(async (tx) => {
            let resolvedCategoryId = data.categoryId;
            if (!resolvedCategoryId) {
                const firstCat = await tx.tariffCategory.findFirst({
                    where: { status: 'ACTIVE' },
                    orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
                });
                resolvedCategoryId = firstCat?.id ?? 1;
            }

            const schedule = await tx.tariffSchedule.upsert({
                where: {
                    categoryId_year_month: {
                        categoryId: resolvedCategoryId,
                        year: data.year,
                        month: data.month,
                    },
                },
                create: {
                    noticeId: data.noticeId,
                    categoryId: resolvedCategoryId,
                    year: data.year,
                    month: data.month,
                    isHotSeason: data.isHotSeason ?? false,
                    maintenanceFeeKip: data.maintenanceFeeKip !== undefined ? data.maintenanceFeeKip : null,
                },
                update: {
                    noticeId: data.noticeId,
                    isHotSeason: data.isHotSeason ?? false,
                    maintenanceFeeKip: data.maintenanceFeeKip !== undefined ? data.maintenanceFeeKip : null,
                },
            });

            for (const tier of data.tiers) {
                await tx.tariffTier.upsert({
                    where: {
                        scheduleId_tierOrder: {
                            scheduleId: schedule.id,
                            tierOrder: tier.tierOrder,
                        },
                    },
                    create: {
                        scheduleId: schedule.id,
                        tierOrder: tier.tierOrder,
                        label: tier.label,
                        minKwh: tier.minKwh,
                        maxKwh: tier.maxKwh ?? null,
                        rateKipPerKwh: tier.rateKipPerKwh,
                    },
                    update: {
                        label: tier.label,
                        minKwh: tier.minKwh,
                        maxKwh: tier.maxKwh ?? null,
                        rateKipPerKwh: tier.rateKipPerKwh,
                    },
                });
            }

            return tx.tariffSchedule.findUniqueOrThrow({
                where: { id: schedule.id },
                include: {
                    notice: true,
                    category: true,
                    tiers: { orderBy: { tierOrder: 'asc' } },
                },
            }) as Promise<ScheduleWithTiersAndNotice>;
        });
    }

    async deleteSchedule(id: number): Promise<TariffSchedule> {
        return this.prisma.tariffSchedule.delete({ where: { id } });
    }
}
