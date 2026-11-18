import { Injectable } from '@nestjs/common';
import { SavingActionTemplate } from '../../../../generated/prisma/client.js';
import { ScheduleWithTiersAndNotice } from '../repositories/electricity-calculator.repository.interface.js';

export interface ApplianceInputItem {
    id?: string | number;
    categoryId?: number | null;
    categoryCode?: string;
    presetId?: number | null;
    presetCode?: string | null;
    customName?: string;
    watt: number;
    quantity: number;
    hoursPerDay: number;
    daysPerMonth?: number;
}

export interface ProgressiveTierResult {
    tierOrder: number;
    label: string;
    minKwh: number;
    maxKwh: number | null;
    tierKwh: number;
    rateKipPerKwh: number;
    costKip: number;
}

export interface ProgressiveBillResult {
    totalKwh: number;
    highestTierOrder: number;
    baseCostKip: number;
    hotSeasonDiscountKip: number;
    netBaseCostKip: number;
    maintenanceFeeKip: number;
    subtotalBeforeVatKip: number;
    vatCostKip: number;
    totalCostKip: number;
    tierBreakdown: ProgressiveTierResult[];
}

export interface SavingRecommendationResult {
    templateId: number;
    templateCode: string;
    titleLa: string;
    titleEn?: string | null;
    descriptionLa: string;
    descriptionEn?: string | null;
    effortLevel: string;
    appliedApplianceCount: number;
    savedKwhPerMonth: number;
    savedKipPerMonth: number;
    isDefaultSelected: boolean;
}

export interface EvaluatedSavingPlan {
    totalSavedKwh: number;
    afterPlanKwh: number;
    afterBill: ProgressiveBillResult;
    monthlySavedKip: number;
    yearlySavedKip: number;
    recommendations: SavingRecommendationResult[];
}

@Injectable()
export class ElectricityCalculationEngineService {
    /**
     * ຄຳນວນ kWh ຕໍ່ເດືອນສຳລັບເຄື່ອງໃຊ້ໄຟຟ້າແຕ່ລະລາຍການ:
     * kWh = (Watt * ຈຳນວນເຄື່ອງ * ຊົ່ວໂມງ/ມື້ * ວັນ/ເດືອນ) / 1,000
     */
    calculateApplianceMonthlyKwh(appliance: ApplianceInputItem): number {
        const days = appliance.daysPerMonth ?? 30;
        const totalWattHours = appliance.watt * appliance.quantity * appliance.hoursPerDay * days;
        const monthlyKwh = totalWattHours / 1000;
        return Number(monthlyKwh.toFixed(2));
    }

    /**
     * ຄຳນວນຄ່າໄຟຟ້າແບບຂັ້ນບັນໄດ (8 ຂັ້ນ):
     * - ຄຳນວນແຕ່ລະຂັ້ນຕາມອັດຕາ (Rate Kip/kWh)
     * - ຄິດໄລ່ສ່ວນຫຼຸດລະດູຮ້ອນ (ຖ້າແມ່ນ isHotSeason ແລະ kWh ບໍ່ເກີນ cap)
     * - ບວກຄ່າຊ່ອມບຳລຸງຮັກສາ (maintenanceFeeKip)
     * - ຄິດໄລ່ອາກອນມູນຄ່າເພີ່ມ VAT 10%
     * ສູດລວມ: Total = (Net Base Cost + Maintenance Fee) * (1 + VAT)
     */
    calculateProgressiveBill(
        totalKwh: number,
        schedule: ScheduleWithTiersAndNotice,
        customMaintenanceFeeKip?: number,
    ): ProgressiveBillResult {
        const roundedKwh = Math.max(0, Number(totalKwh.toFixed(2)));
        let remainingKwh = roundedKwh;
        let baseCostKip = 0;
        let highestTierOrder = 1;
        const tierBreakdown: ProgressiveTierResult[] = [];

        // ຈັດຮຽງ tiers ຕາມ tierOrder
        const sortedTiers = [...schedule.tiers].sort((a, b) => a.tierOrder - b.tierOrder);

        for (const tier of sortedTiers) {
            if (remainingKwh <= 0 && tier.tierOrder > 1) {
                tierBreakdown.push({
                    tierOrder: tier.tierOrder,
                    label: tier.label,
                    minKwh: tier.minKwh,
                    maxKwh: tier.maxKwh,
                    tierKwh: 0,
                    rateKipPerKwh: Number(tier.rateKipPerKwh),
                    costKip: 0,
                });
                continue;
            }

            const tierSpan =
                tier.maxKwh !== null && tier.maxKwh !== undefined
                    ? (tier.minKwh === 0 ? tier.maxKwh : tier.maxKwh - tier.minKwh + 1)
                    : null;

            let kwhInThisTier = 0;
            if (tierSpan === null) {
                // ຂັ້ນສູງສຸດ (ເຊັ່ນ > 1,500)
                kwhInThisTier = remainingKwh;
            } else {
                kwhInThisTier = Math.min(remainingKwh, tierSpan);
            }

            kwhInThisTier = Math.max(0, Number(kwhInThisTier.toFixed(2)));
            const rate = Number(tier.rateKipPerKwh);
            const costInThisTier = Number((kwhInThisTier * rate).toFixed(2));

            baseCostKip += costInThisTier;
            remainingKwh -= kwhInThisTier;

            if (kwhInThisTier > 0) {
                highestTierOrder = tier.tierOrder;
            }

            tierBreakdown.push({
                tierOrder: tier.tierOrder,
                label: tier.label,
                minKwh: tier.minKwh,
                maxKwh: tier.maxKwh,
                tierKwh: kwhInThisTier,
                rateKipPerKwh: rate,
                costKip: costInThisTier,
            });
        }

        baseCostKip = Number(baseCostKip.toFixed(2));

        // ສ່ວນຫຼຸດລະດູຮ້ອນ (ຖ້າຢູ່ໃນຊ່ວງລະດູຮ້ອນ ແລະ ໜ່ວຍໄຟບໍ່ເກີນ Cap ເຊັ່ນ 300 kWh)
        let hotSeasonDiscountKip = 0;
        if (
            schedule.isHotSeason &&
            schedule.notice.hotSeasonDiscountCapKwh &&
            roundedKwh <= schedule.notice.hotSeasonDiscountCapKwh
        ) {
            // ສ່ວນຫຼຸດຕາມເງື່ອນໄຂລະດູຮ້ອນຂອງ ຟຟລ (ຖ້າມີ)
            hotSeasonDiscountKip = 0;
        }

        const netBaseCostKip = Math.max(0, Number((baseCostKip - hotSeasonDiscountKip).toFixed(2)));

        // ຄ່າຊ່ອມບຳລຸງຮັກສາ (Maintenance Fee)
        let maintenanceFeeKip = 0;
        if (customMaintenanceFeeKip !== undefined && customMaintenanceFeeKip !== null) {
            maintenanceFeeKip = Number(customMaintenanceFeeKip);
        } else if (schedule.maintenanceFeeKip !== null && schedule.maintenanceFeeKip !== undefined) {
            maintenanceFeeKip = Number(schedule.maintenanceFeeKip);
        } else if (schedule.notice.maintenanceFeeKip !== null && schedule.notice.maintenanceFeeKip !== undefined) {
            maintenanceFeeKip = Number(schedule.notice.maintenanceFeeKip);
        }

        maintenanceFeeKip = Number(maintenanceFeeKip.toFixed(2));

        // ລວມກ່ອນ VAT = ຄ່າໄຟຖານຫຼັງຫັກສ່ວນຫຼຸດ + ຄ່າຊ່ອມບຳລຸງ
        const subtotalBeforeVatKip = Number((netBaseCostKip + maintenanceFeeKip).toFixed(2));

        // VAT (ອາກອນມູນຄ່າເພີ່ມ) ຄິດໄລ່ຈາກ (ຄ່າໄຟ + ຄ່າຊ່ອມບຳລຸງ)
        const vatRate = Number(schedule.notice.vatRate ?? 0.1);
        const vatCostKip = Number((subtotalBeforeVatKip * vatRate).toFixed(2));

        // ຄ່າໄຟລວມສຸດທິ
        const totalCostKip = Number((subtotalBeforeVatKip + vatCostKip).toFixed(2));

        return {
            totalKwh: roundedKwh,
            highestTierOrder,
            baseCostKip,
            hotSeasonDiscountKip,
            netBaseCostKip,
            maintenanceFeeKip,
            subtotalBeforeVatKip,
            vatCostKip,
            totalCostKip,
            tierBreakdown,
        };
    }

    /**
     * ປະເມີນແຜນປະຢັດໄຟຟ້າ (Saving Plan Evaluation):
     * ສະໜັບສະໜູນ 3 ຮູບແບບສູດ:
     * 1. FIXED_FRACTION: ປະຢັດຕາມ % ຄົງທີ່ (ເຊັ່ນ ຕັ້ງແອ 26°C ຫຼຸດ 15% -> savedKwh = kwh * 0.15)
     * 2. REDUCE_HOURS: ຫຼຸດຊົ່ວໂມງນຳໃຊ້ຕໍ່ມື້ (ເຊັ່ນ ຕັ້ງເວລາປິດແອໄວຂຶ້ນ 1 ຊມ -> savedKwh = (Watt * Qty * reduceHours * Days) / 1000)
     * 3. REPLACE_WATTAGE: ປ່ຽນເຄື່ອງໃຊ້ໄຟຟ້າປະຢັດພະລັງງານ (ເຊັ່ນ ດອກໄຟເກົ່າ 36W ເປັນ LED 9–16W)
     */
    evaluateSavingPlan(
        appliances: Array<ApplianceInputItem & { monthlyKwh: number }>,
        availableTemplates: SavingActionTemplate[],
        selectedActionCodes?: Array<string | number>,
        schedule?: ScheduleWithTiersAndNotice,
        beforeBill?: ProgressiveBillResult,
        customMaintenanceFeeKip?: number,
    ): EvaluatedSavingPlan {
        const selectedSet = selectedActionCodes
            ? new Set(selectedActionCodes.map((c) => String(c)))
            : new Set(availableTemplates.filter((t) => t.defaultSelected).map((t) => String(t.id)));

        let totalSavedKwh = 0;
        const recommendations: SavingRecommendationResult[] = [];

        for (const template of availableTemplates) {
            // ຊອກຫາເຄື່ອງໃຊ້ໄຟຟ້າທີ່ຕົກໃນໝວດໝູ່ຂອງ template ນີ້
            const matchedAppliances = appliances.filter((a) => {
                if (a.categoryId && template.categoryId) {
                    return a.categoryId === template.categoryId;
                }
                const templateCategoryCode = (
                    (template as any).categoryCode ??
                    (template as any).category?.code ??
                    ''
                ).toLowerCase();
                const appCatCode = (a.categoryCode ?? '').toLowerCase();
                if (appCatCode && templateCategoryCode && appCatCode === templateCategoryCode) {
                    return true;
                }
                return false;
            });

            if (matchedAppliances.length === 0) {
                continue;
            }

            let savedKwhForThisTemplate = 0;

            for (const app of matchedAppliances) {
                const days = app.daysPerMonth ?? 30;

                switch (template.ruleType) {
                    case 'FIXED_FRACTION': {
                        const fraction = Number(template.fixedFraction ?? 0.15);
                        savedKwhForThisTemplate += app.monthlyKwh * fraction;
                        break;
                    }
                    case 'REDUCE_HOURS': {
                        const reduceH = Number(template.reduceHoursBy ?? 1.0);
                        const actualReduceH = Math.min(app.hoursPerDay, reduceH);
                        const savedKwh = (app.watt * app.quantity * actualReduceH * days) / 1000;
                        savedKwhForThisTemplate += savedKwh;
                        break;
                    }
                    case 'REPLACE_WATTAGE': {
                        const targetWattLow = template.targetWattLow ?? 9;
                        const targetWattHigh = template.targetWattHigh ?? 16;
                        const avgTargetWatt = (targetWattLow + targetWattHigh) / 2;
                        const deltaWatt = Math.max(0, app.watt - avgTargetWatt);
                        const savedKwh = (deltaWatt * app.quantity * app.hoursPerDay * days) / 1000;
                        savedKwhForThisTemplate += savedKwh;
                        break;
                    }
                }
            }

            savedKwhForThisTemplate = Number(savedKwhForThisTemplate.toFixed(2));

            const isSelected = selectedSet.has(String(template.id)) || Boolean((template as any).code && selectedSet.has((template as any).code));
            if (isSelected) {
                totalSavedKwh += savedKwhForThisTemplate;
            }

            recommendations.push({
                templateId: template.id,
                templateCode: (template as any).code ?? String(template.id),
                titleLa: template.titleLa,
                titleEn: template.titleEn,
                descriptionLa: template.descriptionLa,
                descriptionEn: template.descriptionEn,
                effortLevel: template.effortLevel,
                appliedApplianceCount: matchedAppliances.length,
                savedKwhPerMonth: savedKwhForThisTemplate,
                savedKipPerMonth: 0,
                isDefaultSelected: isSelected,
            });
        }

        totalSavedKwh = Number(totalSavedKwh.toFixed(2));
        const originalKwh = beforeBill ? beforeBill.totalKwh : appliances.reduce((sum, a) => sum + a.monthlyKwh, 0);
        const afterPlanKwh = Math.max(0, Number((originalKwh - totalSavedKwh).toFixed(2)));

        let afterBill: ProgressiveBillResult;
        let monthlySavedKip = 0;
        let yearlySavedKip = 0;

        if (schedule && beforeBill) {
            afterBill = this.calculateProgressiveBill(afterPlanKwh, schedule, customMaintenanceFeeKip);
            monthlySavedKip = Math.max(0, Number((beforeBill.totalCostKip - afterBill.totalCostKip).toFixed(2)));
            yearlySavedKip = Number((monthlySavedKip * 12).toFixed(2));

            // ອັບເດດ savedKipPerMonth ໃຫ້ກັບແຕ່ລະ recommendation ຕາມສັດສ່ວນ kWh
            for (const rec of recommendations) {
                if (totalSavedKwh > 0 && monthlySavedKip > 0) {
                    const ratio = rec.savedKwhPerMonth / totalSavedKwh;
                    rec.savedKipPerMonth = Number((monthlySavedKip * ratio).toFixed(2));
                }
            }
        } else {
            afterBill = {
                totalKwh: afterPlanKwh,
                highestTierOrder: 1,
                baseCostKip: 0,
                hotSeasonDiscountKip: 0,
                netBaseCostKip: 0,
                maintenanceFeeKip: 0,
                subtotalBeforeVatKip: 0,
                vatCostKip: 0,
                totalCostKip: 0,
                tierBreakdown: [],
            };
        }

        return {
            totalSavedKwh,
            afterPlanKwh,
            afterBill,
            monthlySavedKip,
            yearlySavedKip,
            recommendations,
        };
    }
}
