import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { HttpModule } from "@nestjs/axios";
import { VillagesController } from "./presentation/villages.controller.js";
import { SyncVillagesUseCase } from "./application/use-cases/sync-villages.use-case.js";
import { GetVillagesUseCase } from "./application/use-cases/get-villages.use-case.js";
import { VILLAGE_REPOSITORY } from "./domain/repositories/village.repository.interface.js";
import { PrismaVillageRepository } from "./infrastructure/database/prisma-village.repository.js";
import { HRM_VILLAGE_SERVICE } from "./domain/repositories/hrm-village.service.interface.js";
import { HrmVillageService } from "./infrastructure/external/hrm-village.service.js";

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [VillagesController],
    providers: [
        SyncVillagesUseCase,
        GetVillagesUseCase,
        {
            provide: VILLAGE_REPOSITORY,
            useClass: PrismaVillageRepository,
        },
        {
            provide: HRM_VILLAGE_SERVICE,
            useClass: HrmVillageService,
        }
    ]
})
export class VillagesModule { }