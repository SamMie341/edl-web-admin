import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as branchRepositoryInterface from "../../domain/repositories/branch.repository.interface.js";

@Injectable()
export class DeleteBranchUseCase {
    constructor(@Inject(branchRepositoryInterface.BRANCH_REPOSITORY) private readonly repo: branchRepositoryInterface.IBranchRepository) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນສາຂານີ້`);
        return this.repo.delete(id);
    }
}