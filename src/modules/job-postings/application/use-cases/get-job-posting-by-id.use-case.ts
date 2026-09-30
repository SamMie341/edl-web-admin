import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as jobPostingRepositoryInterface from '../../domain/repositories/job-posting.repository.interface.js';

@Injectable()
export class GetJobPostingByIdUseCase {
    constructor(@Inject(jobPostingRepositoryInterface.JOB_POSTING_REPOSITORY) private readonly repository: jobPostingRepositoryInterface.IJobPostingRepository) { }
    async execute(id: number) {
        const jobPosting = await this.repository.findById(id);
        if (!jobPosting) throw new NotFoundException('ບໍ່ພົບປະກາດຮັບສະໝັກງານ');
        return jobPosting;
    }
}