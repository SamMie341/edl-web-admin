import { Injectable, Inject } from '@nestjs/common';
import * as legislationRepository from '../../domain/repositories/legislation.repository.js';

@Injectable()
export class GetLegislationsUseCase {
    constructor(@Inject(legislationRepository.LEGISLATION_REPOSITORY) private readonly repository: legislationRepository.ILegislationRepository) { }
    async execute(search?: string, page: number = 1, limit: number = 10) {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
        return this.repository.findAll(search, validPage, validLimit);
    }
}