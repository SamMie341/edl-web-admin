import { Injectable, Inject } from '@nestjs/common';
import * as positionRepositoryInterface from '../../domain/repositories/position.repository.interface.js';

@Injectable()
export class GetPositionsUseCase {
    constructor(@Inject(positionRepositoryInterface.POSITION_REPOSITORY) private readonly repository: positionRepositoryInterface.IPositionRepository) { }
    async execute(search?: string, page: number = 1, limit: number = 10) {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
        return this.repository.findAll(search, validPage, validLimit);
    }
}