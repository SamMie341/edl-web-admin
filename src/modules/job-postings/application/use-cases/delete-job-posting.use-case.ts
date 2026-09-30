import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as jobPostingRepositoryInterface from '../../domain/repositories/job-posting.repository.interface.js';

@Injectable()
export class DeleteJobPostingUseCase {
    constructor(@Inject(jobPostingRepositoryInterface.JOB_POSTING_REPOSITORY) private readonly repository: jobPostingRepositoryInterface.IJobPostingRepository) { }
    async execute(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບປະກາດຮັບສະໝັກງານ');
        return this.repository.delete(id);
    }
}