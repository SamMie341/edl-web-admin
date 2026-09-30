import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as jobPostingRepositoryInterface from '../../domain/repositories/job-posting.repository.interface.js';
import { CreateJobPostingDto } from '../dtos/create-job-posting.dto.js';

@Injectable()
export class CreateJobPostingUseCase {
    constructor(@Inject(jobPostingRepositoryInterface.JOB_POSTING_REPOSITORY) private readonly repository: jobPostingRepositoryInterface.IJobPostingRepository) { }

    async execute(dto: CreateJobPostingDto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);

        if (endDate < startDate) {
            throw new BadRequestException('ວັນທີສິ້ນສຸດ ຕ້ອງຫຼາຍກວ່າ ຫຼື ເທົ່າກັບວັນທີເລີ່ມຕົ້ນ');
        }

        const dataToSave = {
            ...dto,
            startDate,
            endDate,
        };
        return this.repository.create(dataToSave);
    }
}