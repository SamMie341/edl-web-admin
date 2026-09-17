import { Inject, Injectable } from "@nestjs/common";
import * as orgStructureRepositoryInterface from "../../domain/repositories/org-structure.repository.interface.js";
import { CreateOrgStructureDto } from "../dtos/create-org-structure.dto.js";

@Injectable()
export class CreateOrgStructureUseCase {
    constructor(@Inject(orgStructureRepositoryInterface.ORG_STRUCTURE_REPOSITORY) private readonly repo: orgStructureRepositoryInterface.IOrgStructureRepository) { }

    async execute(dto: CreateOrgStructureDto) {
        return await this.repo.create(dto);
    }
}