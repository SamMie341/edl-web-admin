import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    ELECTRICITY_CALCULATOR_REPOSITORY,
    type IElectricityCalculatorRepository,
    type ScheduleWithTiersAndNotice,
} from '../../domain/repositories/electricity-calculator.repository.interface.js';
import { ElectricityCalculationEngineService } from '../../domain/services/electricity-calculation-engine.service.js';
import { CalculateElectricityDto } from '../dtos/calculate-electricity.dto.js';

@Injectable()
export class CalculateElectricityBillUseCase {
    constructor(
        @Inject(ELECTRICITY_CALCULATOR_REPOSITORY)
        private readonly repository: IElectricityCalculatorRepository,
        private readonly calculationEngine: ElectricityCalculationEngineService,
    ) { }

    async execute(dto: CalculateElectricityDto) {
        const hasAppliances = Array.isArray(dto.appliances) && dto.appliances.length > 0;
        const hasDirectKwh = dto.directMonthlyKwh !== undefined && dto.directMonthlyKwh !== null;

        if (!hasAppliances && !hasDirectKwh) {
            throw new BadRequestException(
                'ກະລຸນາລະບຸລາຍການເຄື່ອງໃຊ້ໄຟຟ້າ (appliances) ຫຼື ຈຳນວນໜ່ວຍໄຟລວມຕໍ່ເດືອນ (directMonthlyKwh)',
            );
        }

        const year = dto.year ?? 2026;
        const month = dto.month ?? 11;
        const categoryId = dto.categoryId;

        const schedule = await this.repository.findScheduleByYearMonth(year, month, categoryId);
        if (!schedule) {
            throw new NotFoundException(`ບໍ່ພົບຕາຕະລາງອັດຕາຄ່າໄຟສຳລັບເດືອນ ${month}/${year}`);
        }

        // 1. ຄຳນວນ kWh ແຍກຕາມເຄື່ອງໃຊ້ໄຟຟ້າແຕ່ລະລາຍການ (ຫຼື ໃຊ້ directMonthlyKwh)
        const evaluatedAppliances = (dto.appliances ?? []).map((item, index) => {
            const monthlyKwh = this.calculationEngine.calculateApplianceMonthlyKwh(item);
            return {
                index,
                categoryId: item.categoryId ?? null,
                categoryCode: item.categoryCode ?? '',
                presetId: item.presetId ?? null,
                presetCode: item.presetCode ?? null,
                customName: item.customName ?? item.categoryCode ?? 'Appliance',
                watt: item.watt,
                quantity: item.quantity,
                hoursPerDay: item.hoursPerDay,
                daysPerMonth: item.daysPerMonth ?? 30,
                monthlyKwh,
            };
        });

        const totalAppliancesKwh = evaluatedAppliances.reduce((sum, a) => sum + a.monthlyKwh, 0);
        const totalMonthlyKwh = hasDirectKwh ? Number(dto.directMonthlyKwh) : totalAppliancesKwh;

        // 2. ຄຳນວນຄ່າໄຟກ່ອນປັບແຜນປະຢັດ (Current Bill)
        const currentBill = this.calculationEngine.calculateProgressiveBill(
            totalMonthlyKwh,
            schedule,
            dto.maintenanceFeeKip,
        );

        // 3. ຄຳນວນສັດສ່ວນການໃຊ້ໄຟຂອງແຕ່ລະເຄື່ອງໃຊ້ໄຟຟ້າ (%)
        const appliancesBreakdown = evaluatedAppliances.map((app) => ({
            ...app,
            sharePercent:
                currentBill.totalKwh > 0
                    ? Number(((app.monthlyKwh / currentBill.totalKwh) * 100).toFixed(1))
                    : 0,
        }));

        // 4. ຄຳນວນແຜນປະຢັດໄຟ (Saving Plan)
        const activeTemplates = await this.repository.findActiveSavingTemplates();
        const savingPlan = this.calculationEngine.evaluateSavingPlan(
            evaluatedAppliances,
            activeTemplates,
            dto.selectedActionIds ?? dto.selectedActionCodes,
            schedule,
            currentBill,
            dto.maintenanceFeeKip,
        );

        // 5. ຄາດການຄ່າໄຟລ່ວງໜ້າ (Outlook 2026–2029) ເພື່ອປຽບທຽບແນວໂນ້ມລາຍປີ
        const outlookSchedules = await this.repository.findSchedulesByYearRange(2026, 2029, categoryId);
        const yearlyOutlookMap = new Map<number, ScheduleWithTiersAndNotice>();
        for (const s of outlookSchedules) {
            if (s.month === schedule.month || !yearlyOutlookMap.has(s.year)) {
                yearlyOutlookMap.set(s.year, s);
            }
        }

        const yearlyOutlook = Array.from(yearlyOutlookMap.values()).map((yrSched) => {
            const beforeYr = this.calculationEngine.calculateProgressiveBill(
                currentBill.totalKwh,
                yrSched,
                dto.maintenanceFeeKip,
            );
            const afterYr = this.calculationEngine.calculateProgressiveBill(
                savingPlan.afterPlanKwh,
                yrSched,
                dto.maintenanceFeeKip,
            );
            const savedPerMonth = Math.max(0, beforeYr.totalCostKip - afterYr.totalCostKip);
            return {
                year: yrSched.year,
                month: yrSched.month,
                beforeTotalCostKip: beforeYr.totalCostKip,
                afterTotalCostKip: afterYr.totalCostKip,
                monthlySavedKip: Number(savedPerMonth.toFixed(2)),
                yearlySavedKip: Number((savedPerMonth * 12).toFixed(2)),
            };
        });

        return {
            selectedPeriod: {
                scheduleId: schedule.id,
                categoryId: schedule.categoryId,
                categoryNameLa: schedule.category?.nameLa,
                categoryNameEn: schedule.category?.nameEn,
                categoryGroup: schedule.category?.categoryGroup,
                voltageLevel: schedule.category?.voltageLevel,
                year: schedule.year,
                month: schedule.month,
                isHotSeason: schedule.isHotSeason,
                noticeNumber: schedule.notice.noticeNumber,
                vatRate: Number(schedule.notice.vatRate),
                maintenanceFeeKip: currentBill.maintenanceFeeKip,
            },
            summary: {
                totalMonthlyKwh: currentBill.totalKwh,
                afterPlanKwh: savingPlan.afterPlanKwh,
                totalSavedKwh: savingPlan.totalSavedKwh,
                currentTierOrder: currentBill.highestTierOrder,
                afterTierOrder: savingPlan.afterBill.highestTierOrder,
                baseCostKip: currentBill.baseCostKip,
                hotSeasonDiscountKip: currentBill.hotSeasonDiscountKip,
                netBaseCostKip: currentBill.netBaseCostKip,
                maintenanceFeeKip: currentBill.maintenanceFeeKip,
                subtotalBeforeVatKip: currentBill.subtotalBeforeVatKip,
                vatCostKip: currentBill.vatCostKip,
                totalCostKip: currentBill.totalCostKip,
                afterPlanCostKip: savingPlan.afterBill.totalCostKip,
                monthlySavedKip: savingPlan.monthlySavedKip,
                yearlySavedKip: savingPlan.yearlySavedKip,
            },
            currentBill,
            afterPlanBill: savingPlan.afterBill,
            appliances: appliancesBreakdown,
            savingRecommendations: savingPlan.recommendations,
            yearlyOutlook,
        };
    }
}
