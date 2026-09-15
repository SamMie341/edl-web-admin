import { Inject, Injectable } from "@nestjs/common";
import * as branchRepositoryInterface from "../../domain/repositories/branch.repository.interface.js";
import { CreateBranchDto } from "../dtos/create-branch.dto.js";

@Injectable()
export class CreateBranchUseCase {
    constructor(@Inject(branchRepositoryInterface.BRANCH_REPOSITORY) private readonly repo: branchRepositoryInterface.IBranchRepository) { }

    async execute(dto: CreateBranchDto) {
        return this.repo.create(dto);
    }
}