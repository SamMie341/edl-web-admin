import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { GetDistrictsUseCase } from './application/use-cases/get-districts.use-case.js';
import { SyncDistrictsUseCase } from './application/use-cases/sync-districts.use-case.js';
import { DISTRICT_REPOSITORY } from './domain/repositories/district.repository.interface.js';
import { HRM_DISTRICT_SERVICE } from './domain/repositories/hrm-district.service.interface.js';
import { PrismaDistrictRepository } from './infrastructure/database/prisma-district.repository.js';
import { HrmDistrictService } from './infrastructure/external/hrm-district.service.js';
import { DistrictsController } from './presentation/districts.controller.js';

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [DistrictsController],
    providers: [
        SyncDistrictsUseCase,
        GetDistrictsUseCase,
        {
            provide: DISTRICT_REPOSITORY,
            useClass: PrismaDistrictRepository,
        },
        {
            provide: HRM_DISTRICT_SERVICE,
            useClass: HrmDistrictService,
        },
    ],
})
export class DistrictsModule { }