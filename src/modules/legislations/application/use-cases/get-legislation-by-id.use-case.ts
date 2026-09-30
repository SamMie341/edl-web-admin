import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as legislationRepository from '../../domain/repositories/legislation.repository.js';

@Injectable()
export class GetLegislationByIdUseCase {
    constructor(@Inject(legislationRepository.LEGISLATION_REPOSITORY) private readonly repository: legislationRepository.ILegislationRepository) { }
    async execute(id: number) {
        const legislation = await this.repository.findById(id);
        if (!legislation) throw new NotFoundException('ບໍ່ພົບເອກະສານນິຕິກຳ');
        return legislation;
    }
}