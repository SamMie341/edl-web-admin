import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as branchRepositoryInterface from "../../domain/repositories/branch.repository.interface.js";

@Injectable()
export class UploadBranchImageUseCase {
    constructor(@Inject(branchRepositoryInterface.BRANCH_REPOSITORY)
    private readonly repo: branchRepositoryInterface.IBranchRepository,
    ) { }

    async execute(id: number, imageType: 'branchImage' | 'coverImage' | 'orgChartImage', filePath: string) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ພົບສາຂາ`);
        const dataToSave = { [imageType]: filePath };
        return this.repo.update(id, dataToSave);
    }
}