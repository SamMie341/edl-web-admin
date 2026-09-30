import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateProcurementUseCase } from './application/use-cases/create-procurement.use-case.js';
import { DeleteProcurementUseCase } from './application/use-cases/delete-procurement.use-case.js';
import { GetProcurementByIdUseCase } from './application/use-cases/get-procurement-by-id.use-case.js';
import { GetProcurementsUseCase } from './application/use-cases/get-procurement.use-case.js';
import { UpdateProcurementUseCase } from './application/use-cases/update-procurement.use-case.js';
import { UploadProcurementFilesUseCase } from './application/use-cases/upload-procurement-files.use-case.js';
import { PROCUREMENT_REPOSITORY } from './domain/repositories/procurement.repository.interface.js';
import { PrismaProcurementRepository } from './infrastructure/database/prisma-infrastructure.repository.js';
import { ProcurementsController } from './presentation/procurements.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [ProcurementsController],
    providers: [
        CreateProcurementUseCase,
        UpdateProcurementUseCase,
        DeleteProcurementUseCase,
        GetProcurementsUseCase,
        GetProcurementByIdUseCase,
        UploadProcurementFilesUseCase,
        {
            provide: PROCUREMENT_REPOSITORY,
            useClass: PrismaProcurementRepository,
        },
    ],
})
export class ProcurementsModule { }