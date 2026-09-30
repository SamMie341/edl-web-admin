import { Injectable, Inject } from '@nestjs/common';
import * as jobPostingRepositoryInterface from '../../domain/repositories/job-posting.repository.interface.js';

@Injectable()
export class GetJobPostingsUseCase {
    constructor(@Inject(jobPostingRepositoryInterface.JOB_POSTING_REPOSITORY) private readonly repository: jobPostingRepositoryInterface.IJobPostingRepository) { }
    async execute(search?: string, page: number = 1, limit: number = 10) {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
        return this.repository.findAll(search, validPage, validLimit);
    }
}