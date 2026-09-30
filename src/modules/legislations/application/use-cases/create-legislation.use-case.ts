import { Injectable, Inject } from '@nestjs/common';
import * as legislationRepository from '../../domain/repositories/legislation.repository.js';
import { CreateLegislationDto } from '../dto/create-legislation.dto.js';

@Injectable()
export class CreateLegislationUseCase {
    constructor(@Inject(legislationRepository.LEGISLATION_REPOSITORY) private readonly repository: legislationRepository.ILegislationRepository) { }
    async execute(dto: CreateLegislationDto) {
        const dataToSave = {
            ...dto,
            issueDate: new Date(dto.issueDate),
            fileUrl: dto.fileUrl || '',
        };
        return this.repository.create(dataToSave);
    }
}