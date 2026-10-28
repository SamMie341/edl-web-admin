import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as visionMissionRepositoryInterface from "../../domain/repositories/vision-mission.repository.interface.js";

@Injectable()
export class GetVisionMissionByIdUseCase {
    constructor(
        @Inject(visionMissionRepositoryInterface.VISION_MISSION_REPOSITORY) private readonly repo: visionMissionRepositoryInterface.IVisionMissionRepository
    ) { }

    async execute(id: number) {
        const data = await this.repo.findById(id);
        if (!data) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນວິໄສທັດ ແລະ ພາລະກິດ');
        return data;
    }
}