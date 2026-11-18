import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateTariffNoticeUseCase } from './application/use-cases/create-tariff-notice.use-case.js';
import { DeleteTariffNoticeUseCase } from './application/use-cases/delete-tariff-notice.use-case.js';
import { DeleteTariffScheduleUseCase } from './application/use-cases/delete-tariff-schedule.use-case.js';
import { GetTariffNoticeByIdUseCase } from './application/use-cases/get-tariff-notice-by-id.use-case.js';
import { GetTariffNoticesUseCase } from './application/use-cases/get-tariff-notices.use-case.js';
import { UpdateTariffNoticeUseCase } from './application/use-cases/update-tariff-notice.use-case.js';
import { UpsertTariffScheduleUseCase } from './application/use-cases/upsert-tariff-schedule.use-case.js';
import { TARIFF_SCHEDULE_REPOSITORY } from './domain/repositories/tariff-schedule.repository.interface.js';
import { PrismaTariffScheduleRepository } from './infrastructure/database/prisma-tariff-schedule.repository.js';
import { TariffSchedulesController } from './presentation/tariff-schedules.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [TariffSchedulesController],
    providers: [
        GetTariffNoticesUseCase,
        GetTariffNoticeByIdUseCase,
        CreateTariffNoticeUseCase,
        UpdateTariffNoticeUseCase,
        DeleteTariffNoticeUseCase,
        UpsertTariffScheduleUseCase,
        DeleteTariffScheduleUseCase,
        {
            provide: TARIFF_SCHEDULE_REPOSITORY,
            useClass: PrismaTariffScheduleRepository,
        },
    ],
    exports: [
        TARIFF_SCHEDULE_REPOSITORY,
        GetTariffNoticesUseCase,
        GetTariffNoticeByIdUseCase,
    ],
})
export class TariffSchedulesModule { }
