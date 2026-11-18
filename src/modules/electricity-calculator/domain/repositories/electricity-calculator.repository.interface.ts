import {
    ApplianceCategory,
    AppliancePreset,
    SavingActionTemplate,
    TariffCategory,
    TariffNotice,
    TariffSchedule,
    TariffTier,
} from '../../../../generated/prisma/client.js';

export const ELECTRICITY_CALCULATOR_REPOSITORY = 'ELECTRICITY_CALCULATOR_REPOSITORY';

export type CategoryWithPresetsAndTemplates = ApplianceCategory & {
    presets: AppliancePreset[];
    actionTemplates: SavingActionTemplate[];
};

export type ScheduleWithTiersAndNotice = TariffSchedule & {
    notice: TariffNotice;
    category: TariffCategory;
    tiers: TariffTier[];
};

export type SavingTemplateWithCategory = SavingActionTemplate & {
    category?: { id: number; nameLa: string; nameEn?: string | null };
};

export interface IElectricityCalculatorRepository {
    findActiveCategoriesWithRelations(): Promise<CategoryWithPresetsAndTemplates[]>;
    findActiveTariffCategories(): Promise<TariffCategory[]>;
    findAvailableSchedulesSummary(): Promise<
        Array<{
            id: number;
            categoryId: number;
            year: number;
            month: number;
            isHotSeason: boolean;
            noticeNumber: string;
        }>
    >;
    findScheduleByYearMonth(
        year: number,
        month: number,
        categoryId?: number,
    ): Promise<ScheduleWithTiersAndNotice | null>;
    findLatestActiveSchedule(): Promise<ScheduleWithTiersAndNotice | null>;
    findActiveSavingTemplates(): Promise<SavingTemplateWithCategory[]>;
    findSchedulesByYearRange(
        startYear: number,
        endYear: number,
        categoryId?: number,
    ): Promise<ScheduleWithTiersAndNotice[]>;
}
