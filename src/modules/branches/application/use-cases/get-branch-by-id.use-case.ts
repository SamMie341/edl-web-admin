import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as branchRepositoryInterface from "../../domain/repositories/branch.repository.interface.js";

@Injectable()
export class GetBranchByIdUseCase {
    constructor(
        @Inject(branchRepositoryInterface.BRANCH_REPOSITORY) private readonly repo: branchRepositoryInterface.IBranchRepository,
    ) { }

    async execute(id: number) {
        const branch = await this.repo.findById(id);
        if (!branch) throw new NotFoundException();
        return branch;
    }
}