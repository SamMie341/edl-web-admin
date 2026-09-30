import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as legislationRepository from '../../domain/repositories/legislation.repository.js';

@Injectable()
export class DeleteLegislationUseCase {
    constructor(@Inject(legislationRepository.LEGISLATION_REPOSITORY) private readonly repository: legislationRepository.ILegislationRepository) { }
    async execute(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບເອກະສານນິຕິກຳ');
        return this.repository.delete(id);
    }
}