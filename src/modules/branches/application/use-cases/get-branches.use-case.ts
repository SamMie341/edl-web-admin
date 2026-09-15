import { Injectable, Inject } from '@nestjs/common';
import * as branchRepositoryInterface from '../../domain/repositories/branch.repository.interface.js';

@Injectable()
export class GetBranchesUseCase {
    constructor(@Inject(branchRepositoryInterface.BRANCH_REPOSITORY) private readonly branchRepository: branchRepositoryInterface.IBranchRepository) { }

    async execute() {
        return this.branchRepository.findAll();
    }
}