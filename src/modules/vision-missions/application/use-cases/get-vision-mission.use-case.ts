import { Inject, Injectable } from "@nestjs/common";
import * as visionMissionRepositoryInterface from "../../domain/repositories/vision-mission.repository.interface.js";

@Injectable()
export class GetVisionMissionUseCase {
    constructor(@Inject(visionMissionRepositoryInterface.VISION_MISSION_REPOSITORY) private readonly repo: visionMissionRepositoryInterface.IVisionMissionRepository) { }

    async execute() {
        return await this.repo.findAll();
    }
}