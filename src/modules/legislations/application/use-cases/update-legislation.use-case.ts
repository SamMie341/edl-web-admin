import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as legislationRepository from '../../domain/repositories/legislation.repository.js';
import { UpdateLegislationDto } from '../dto/update-legislation.dto.js';

@Injectable()
export class UpdateLegislationUseCase {
    constructor(@Inject(legislationRepository.LEGISLATION_REPOSITORY) private readonly repository: legislationRepository.ILegislationRepository) { }
    async execute(id: number, dto: UpdateLegislationDto) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບເອກະສານນິຕິກຳ');

        const dataToUpdate = {
            ...dto,
            ...(dto.issueDate && { issueDate: new Date(dto.issueDate) }),
        };

        return this.repository.update(id, dataToUpdate);
    }
}