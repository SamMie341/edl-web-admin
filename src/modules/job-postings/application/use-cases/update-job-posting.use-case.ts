import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import * as jobPostingRepositoryInterface from '../../domain/repositories/job-posting.repository.interface.js';
import { UpdateJobPostingDto } from '../dtos/update-job-posting.dto.js';

@Injectable()
export class UpdateJobPostingUseCase {
    constructor(@Inject(jobPostingRepositoryInterface.JOB_POSTING_REPOSITORY) private readonly repository: jobPostingRepositoryInterface.IJobPostingRepository) { }

    async execute(id: number, dto: UpdateJobPostingDto) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບປະກາດຮັບສະໝັກງານ');

        const startDate = dto.startDate ? new Date(dto.startDate) : existing.startDate;
        const endDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;

        if (endDate < startDate) {
            throw new BadRequestException('ວັນທີສິ້ນສຸດ ຕ້ອງຫຼາຍກວ່າ ຫຼື ເທົ່າກັບວັນທີເລີ່ມຕົ້ນ');
        }

        const dataToUpdate = {
            ...dto,
            ...(dto.startDate && { startDate: new Date(dto.startDate) }),
            ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        };

        return this.repository.update(id, dataToUpdate);
    }
}