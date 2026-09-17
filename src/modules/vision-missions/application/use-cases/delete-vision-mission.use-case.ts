import * as visionMissionRepositoryInterface from '../../domain/repositories/vision-mission.repository.interface.js';
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { VISION_MISSION_REPOSITORY } from '../../domain/repositories/vision-mission.repository.interface.js';

@Injectable()
export class DeleteVisionMissionUseCase {
    constructor(
        @Inject(VISION_MISSION_REPOSITORY)
        private readonly repo: visionMissionRepositoryInterface.IVisionMissionRepository,
    ) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນ');
        return await this.repo.delete(id);
    }
}