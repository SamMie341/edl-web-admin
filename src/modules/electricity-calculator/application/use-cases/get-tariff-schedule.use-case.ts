import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    ELECTRICITY_CALCULATOR_REPOSITORY,
    type IElectricityCalculatorRepository,
} from '../../domain/repositories/electricity-calculator.repository.interface.js';

@Injectable()
export class GetTariffScheduleUseCase {
    constructor(
        @Inject(ELECTRICITY_CALCULATOR_REPOSITORY)
        private readonly repository: IElectricityCalculatorRepository,
    ) { }

    async execute(year: number = 2026, month: number = 11, categoryId?: number) {
        const schedule = await this.repository.findScheduleByYearMonth(year, month, categoryId);
        if (!schedule) {
            throw new NotFoundException(`ບໍ່ພົບຕາຕະລາງອັດຕາຄ່າໄຟສຳລັບເດືອນ ${month}/${year}`);
        }

        return {
            id: schedule.id,
            categoryId: schedule.categoryId,
            category: {
                id: schedule.category.id,
                nameLa: schedule.category.nameLa,
                nameEn: schedule.category.nameEn,
                categoryGroup: schedule.category.categoryGroup,
                voltageLevel: schedule.category.voltageLevel,
            },
            year: schedule.year,
            month: schedule.month,
            isHotSeason: schedule.isHotSeason,
            maintenanceFeeKip: schedule.maintenanceFeeKip !== null && schedule.maintenanceFeeKip !== undefined
                ? Number(schedule.maintenanceFeeKip)
                : Number(schedule.notice.maintenanceFeeKip ?? 0),
            notice: {
                id: schedule.notice.id,
                noticeNumber: schedule.notice.noticeNumber,
                title: schedule.notice.title,
                issuedDate: schedule.notice.issuedDate,
                effectiveFrom: schedule.notice.effectiveFrom,
                effectiveTo: schedule.notice.effectiveTo,
                vatRate: Number(schedule.notice.vatRate),
                hotSeasonDiscountCapKwh: schedule.notice.hotSeasonDiscountCapKwh,
                maintenanceFeeKip: Number(schedule.notice.maintenanceFeeKip ?? 0),
            },
            tiers: schedule.tiers.map((t) => ({
                id: t.id,
                tierOrder: t.tierOrder,
                label: t.label,
                minKwh: t.minKwh,
                maxKwh: t.maxKwh,
                rateKipPerKwh: Number(t.rateKipPerKwh),
            })),
        };
    }
}
