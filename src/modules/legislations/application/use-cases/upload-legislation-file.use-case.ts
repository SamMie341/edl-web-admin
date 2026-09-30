import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as legislationRepository from '../../domain/repositories/legislation.repository.js';

@Injectable()
export class UploadLegislationFileUseCase {
    constructor(@Inject(legislationRepository.LEGISLATION_REPOSITORY) private readonly repository: legislationRepository.ILegislationRepository) { }

    async execute(id: number, filePath: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບເອກະສານນິຕິກຳ');

        return this.repository.update(id, { fileUrl: filePath });
    }
}