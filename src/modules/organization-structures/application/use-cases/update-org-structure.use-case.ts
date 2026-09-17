import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as orgStructureRepositoryInterface from "../../domain/repositories/org-structure.repository.interface.js";
import { UpdateOrgStructureDto } from "../dtos/update-org-structure.dto.js";

@Injectable()
export class UpdateOrgStructureUseCase {
    constructor(@Inject(orgStructureRepositoryInterface.ORG_STRUCTURE_REPOSITORY) private readonly repo: orgStructureRepositoryInterface.IOrgStructureRepository) { }

    async execute(id: number, dto: UpdateOrgStructureDto) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນໂຄງຮ່າງນີ້');
        return await this.repo.update(id, dto);
    }
}