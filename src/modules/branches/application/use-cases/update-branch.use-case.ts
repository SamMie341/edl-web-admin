import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as branchRepositoryInterface from "../../domain/repositories/branch.repository.interface.js";
import { UpdateBranchDto } from "../dtos/update-branch.dto.js";

@Injectable()
export class UpdateBranchUseCase {
    constructor(
        @Inject(branchRepositoryInterface.BRANCH_REPOSITORY) private readonly repo: branchRepositoryInterface.IBranchRepository,
    ) { }

    async execute(id: number, dto: UpdateBranchDto) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນສາຂານີ້`);
        return this.repo.update(id, dto);
    }
}