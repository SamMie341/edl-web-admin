import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { HttpModule } from "@nestjs/axios";
import { ServiceCenterController } from "./presentation/service-centers.controller.js";
import { SyncServiceCenterUseCase } from "./application/use-cases/sync-service-center.use-case.js";
import { GetServiceUseCase } from "./application/use-cases/get-service-center.use-case.js";
import { SERVICE_CENTER_REPOSITORY } from "./domain/repositories/service-center.repository.interface.js";
import { PrismaServiceCenterRepository } from "./infrastructure/database/prisma-service-center.repository.js";
import { LEGACY_CENTER_SERVICE } from "./domain/repositories/legacy-center.service.interface.js";
import { LegacyCenterService } from "./infrastructure/external/legacy-center.service.js";
import { GetServiceByIdUseCase } from "./application/use-cases/get-service-center-by-id.use-case.js";
import { CreateServiceCenterUseCase } from "./application/use-cases/create-service-center.use-case.js";
import { UpdateServiceCenterUseCase } from "./application/use-cases/update-service-center.use-case.js";
import { DeleteServiceCenterUseCase } from "./application/use-cases/delete-service-center.use-case.js";
import { UploadServiceCenterImageUseCase } from "./application/use-cases/upload-service-center-image.use-case.js";

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [ServiceCenterController],
    providers: [
        SyncServiceCenterUseCase,
        GetServiceUseCase,
        GetServiceByIdUseCase,
        CreateServiceCenterUseCase,
        UpdateServiceCenterUseCase,
        DeleteServiceCenterUseCase,
        UploadServiceCenterImageUseCase,
        {
            provide: SERVICE_CENTER_REPOSITORY,
            useClass: PrismaServiceCenterRepository,
        },
        {
            provide: LEGACY_CENTER_SERVICE,
            useClass: LegacyCenterService,
        }
    ]
})
export class ServiceCentersModule { }