import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as orgStructureRepositoryInterface from "../../domain/repositories/org-structure.repository.interface.js";

@Injectable()
export class UploadImageStructureUseCase {
    constructor(@Inject(orgStructureRepositoryInterface.ORG_STRUCTURE_REPOSITORY) private readonly repo: orgStructureRepositoryInterface.IOrgStructureRepository) { }

    async execute(id: number, filePath: string) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນໂຄງສ້າງລະຫັດ ${id} ນີ້`);
        const dataToUpdate = { imageUrl: filePath };
        return this.repo.update(id, dataToUpdate);
    }
}