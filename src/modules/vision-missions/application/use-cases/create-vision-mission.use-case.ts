import { Inject, Injectable } from "@nestjs/common";
import * as visionMissionRepositoryInterface from "../../domain/repositories/vision-mission.repository.interface.js";
import { CreateVisionMissionDto } from "../dtos/create-vision-mission.dto.js";

@Injectable()
export class CreateVisionMissionUseCase {
    constructor(@Inject(visionMissionRepositoryInterface.VISION_MISSION_REPOSITORY) private readonly repo: visionMissionRepositoryInterface.IVisionMissionRepository) { }

    async execute(dto: CreateVisionMissionDto) {
        return await this.repo.create(dto);
    }
}