import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as orgStructureRepositoryInterface from "../../domain/repositories/org-structure.repository.interface.js";

@Injectable()
export class DeleteOrgStructureUseCase {
    constructor(@Inject(orgStructureRepositoryInterface.ORG_STRUCTURE_REPOSITORY) private readonly repo: orgStructureRepositoryInterface.IOrgStructureRepository) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນໂຄງຮ່າງນີ້');
        return await this.repo.delete(id);
    }
}