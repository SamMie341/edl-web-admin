import { Inject, Injectable } from '@nestjs/common';
import {
    ELECTRICITY_CALCULATOR_REPOSITORY,
    type IElectricityCalculatorRepository,
} from '../../domain/repositories/electricity-calculator.repository.interface.js';

@Injectable()
export class GetCalculatorConfigUseCase {
    constructor(
        @Inject(ELECTRICITY_CALCULATOR_REPOSITORY)
        private readonly repository: IElectricityCalculatorRepository,
    ) { }

    async execute() {
        const [categories, tariffCategories, availableSchedules, defaultSchedule] = await Promise.all([
            this.repository.findActiveCategoriesWithRelations(),
            this.repository.findActiveTariffCategories(),
            this.repository.findAvailableSchedulesSummary(),
            this.repository.findScheduleByYearMonth(2026, 11),
        ]);

        const fallbackSchedule = defaultSchedule ?? (await this.repository.findLatestActiveSchedule());

        // ດຶງລາຍການເຄື່ອງໃຊ້ໄຟຟ້າຕົວຢ່າງ (isSampleDefault = true) ເພື່ອໃຫ້ໜ້າເວັບສະແດງຄ່າເລີ່ມຕົ້ນທັນທີ
        const sampleAppliances = categories.flatMap((cat) =>
            cat.presets
                .filter((p) => p.isSampleDefault)
                .map((p) => ({
                    categoryId: cat.id,
                    presetId: p.id,
                    customName: p.nameLa,
                    watt: p.defaultWatt,
                    quantity: p.defaultQuantity,
                    hoursPerDay: Number(p.defaultHoursPerDay),
                    daysPerMonth: p.defaultDaysPerMonth,
                })),
        );

        return {
            categories: categories.map((cat) => ({
                id: cat.id,
                nameLa: cat.nameLa,
                nameEn: cat.nameEn,
                orderIndex: cat.orderIndex,
                presets: cat.presets.map((p) => ({
                    id: p.id,
                    nameLa: p.nameLa,
                    nameEn: p.nameEn,
                    defaultWatt: p.defaultWatt,
                    defaultQuantity: p.defaultQuantity,
                    defaultHoursPerDay: Number(p.defaultHoursPerDay),
                    defaultDaysPerMonth: p.defaultDaysPerMonth,
                    isSampleDefault: p.isSampleDefault,
                })),
                actionTemplates: cat.actionTemplates.map((t) => ({
                    id: t.id,
                    titleLa: t.titleLa,
                    titleEn: t.titleEn,
                    descriptionLa: t.descriptionLa,
                    descriptionEn: t.descriptionEn,
                    effortLevel: t.effortLevel,
                    ruleType: t.ruleType,
                    fixedFraction: t.fixedFraction !== null ? Number(t.fixedFraction) : null,
                    reduceHoursBy: t.reduceHoursBy !== null ? Number(t.reduceHoursBy) : null,
                    targetWattLow: t.targetWattLow,
                    targetWattHigh: t.targetWattHigh,
                    defaultSelected: t.defaultSelected,
                })),
            })),
            tariffCategories: tariffCategories.map((tc) => ({
                id: tc.id,
                nameLa: tc.nameLa,
                nameEn: tc.nameEn,
                categoryGroup: tc.categoryGroup,
                voltageLevel: tc.voltageLevel,
                description: tc.description,
                orderIndex: tc.orderIndex,
            })),
            sampleAppliances,
            availableSchedules,
            defaultSchedule: fallbackSchedule
                ? {
                    id: fallbackSchedule.id,
                    categoryId: fallbackSchedule.categoryId,
                    category: {
                        id: fallbackSchedule.category.id,
                        nameLa: fallbackSchedule.category.nameLa,
                        nameEn: fallbackSchedule.category.nameEn,
                    },
                    year: fallbackSchedule.year,
                    month: fallbackSchedule.month,
                    isHotSeason: fallbackSchedule.isHotSeason,
                    maintenanceFeeKip: fallbackSchedule.maintenanceFeeKip !== null && fallbackSchedule.maintenanceFeeKip !== undefined
                        ? Number(fallbackSchedule.maintenanceFeeKip)
                        : Number(fallbackSchedule.notice.maintenanceFeeKip ?? 0),
                    notice: {
                        noticeNumber: fallbackSchedule.notice.noticeNumber,
                        title: fallbackSchedule.notice.title,
                        vatRate: Number(fallbackSchedule.notice.vatRate),
                        hotSeasonDiscountCapKwh: fallbackSchedule.notice.hotSeasonDiscountCapKwh,
                        maintenanceFeeKip: Number(fallbackSchedule.notice.maintenanceFeeKip ?? 0),
                    },
                    tiers: fallbackSchedule.tiers.map((tier) => ({
                        tierOrder: tier.tierOrder,
                        label: tier.label,
                        minKwh: tier.minKwh,
                        maxKwh: tier.maxKwh,
                        rateKipPerKwh: Number(tier.rateKipPerKwh),
                    })),
                }
                : null,
        };
    }
}
