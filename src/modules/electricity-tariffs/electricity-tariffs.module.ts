import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateElectricityTariffUseCase } from './application/use-cases/create-electricity-tariff.use-case.js';
import { DeleteElectricityTariffUseCase } from './application/use-cases/delete-electricity-tariff.use-case.js';
import { GetElectricityTariffByIdUseCase } from './application/use-cases/get-electricity-tariff-by-id.usecase.js';
import { GetElectricityTariffsUseCase } from './application/use-cases/get-electricity-tariff.use-case.js';
import { UpdateElectricityTariffUseCase } from './application/use-cases/update-electricity-tariff.use-case.js';
import { UploadElectricityTariffFilesUseCase } from './application/use-cases/upload-electricity-tariff-files.use-case.js';
import { ELECTRICITY_TARIFF_REPOSITORY } from './domain/repositories/electricity-tariff.repository.interface.js';
import { PrismaElectricityTariffRepository } from './infrastructure/database/prisma-electricity-tariff.repository.js';
import { ElectricityTariffsController } from './presentation/electricity-tariffs.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [ElectricityTariffsController],
    providers: [
        CreateElectricityTariffUseCase,
        UpdateElectricityTariffUseCase,
        DeleteElectricityTariffUseCase,
        GetElectricityTariffsUseCase,
        GetElectricityTariffByIdUseCase,
        UploadElectricityTariffFilesUseCase,
        {
            provide: ELECTRICITY_TARIFF_REPOSITORY,
            useClass: PrismaElectricityTariffRepository,
        },
    ],
})
export class ElectricityTariffsModule { }