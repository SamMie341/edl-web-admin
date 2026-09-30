import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as jobPostingRepositoryInterface from '../../domain/repositories/job-posting.repository.interface.js';

@Injectable()
export class UploadJobPostingImageUseCase {
    constructor(@Inject(jobPostingRepositoryInterface.JOB_POSTING_REPOSITORY) private readonly repository: jobPostingRepositoryInterface.IJobPostingRepository) { }

    async execute(id: number, filePath: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບປະກາດຮັບສະໝັກງານ');
        return this.repository.update(id, { imageUrl: filePath });
    }
}