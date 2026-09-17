import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as visionMissionRepositoryInterface from "../../domain/repositories/vision-mission.repository.interface.js";

@Injectable()
export class UploadVisionMissionImageUseCase {
    constructor(@Inject(visionMissionRepositoryInterface.VISION_MISSION_REPOSITORY) private readonly repo: visionMissionRepositoryInterface.IVisionMissionRepository) { }

    async execute(id: number, filePath: string) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນ');
        return this.repo.update(id, { imageUrl: filePath });
    }
}