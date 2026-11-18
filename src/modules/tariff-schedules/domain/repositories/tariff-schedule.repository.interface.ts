import {
    TariffCategory,
    TariffNotice,
    TariffSchedule,
    TariffTier,
} from '../../../../generated/prisma/client.js';
import { CreateTariffNoticeDto } from '../../application/dtos/create-tariff-notice.dto.js';
import { UpdateTariffNoticeDto } from '../../application/dtos/update-tariff-notice.dto.js';
import { UpsertTariffScheduleDto } from '../../application/dtos/upsert-tariff-schedule.dto.js';

export const TARIFF_SCHEDULE_REPOSITORY = 'TARIFF_SCHEDULE_REPOSITORY';

export type ScheduleWithTiersAndNotice = TariffSchedule & {
    notice: TariffNotice;
    category: TariffCategory;
    tiers: TariffTier[];
};

export interface ITariffScheduleRepository {
    findAllNotices(): Promise<TariffNotice[]>;
    findNoticeById(id: number): Promise<TariffNotice | null>;
    createNotice(data: CreateTariffNoticeDto): Promise<TariffNotice>;
    updateNotice(id: number, data: UpdateTariffNoticeDto): Promise<TariffNotice>;
    deleteNotice(id: number): Promise<TariffNotice>;

    upsertScheduleWithTiers(data: UpsertTariffScheduleDto): Promise<ScheduleWithTiersAndNotice>;
    deleteSchedule(id: number): Promise<TariffSchedule>;
}
