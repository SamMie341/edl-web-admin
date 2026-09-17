import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { VisionMissionController } from "./presentation/vision-missions.controller.js";
import { CreateVisionMissionUseCase } from "./application/use-cases/create-vision-mission.use-case.js";
import { UpdateVisionMissionUseCase } from "./application/use-cases/update-vision-mission.use-case.js";
import { DeleteVisionMissionUseCase } from "./application/use-cases/delete-vision-mission.use-case.js";
import { GetVisionMissionUseCase } from "./application/use-cases/get-vision-mission.use-case.js";
import { UploadVisionMissionImageUseCase } from "./application/use-cases/upload-vision-mission-image.use-case.js";
import { VISION_MISSION_REPOSITORY } from "./domain/repositories/vision-mission.repository.interface.js";
import { PrismaVisionMissionRepository } from "./infrastructure/database/prisma-vision-mission.repository.js";

@Module({
    imports: [PrismaModule],
    controllers: [VisionMissionController],
    providers: [
        CreateVisionMissionUseCase,
        UpdateVisionMissionUseCase,
        DeleteVisionMissionUseCase,
        GetVisionMissionUseCase,
        UploadVisionMissionImageUseCase,
        {
            provide: VISION_MISSION_REPOSITORY,
            useClass: PrismaVisionMissionRepository,
        }
    ]
})
export class VisionMissionModule { }