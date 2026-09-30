import { Injectable, Inject } from '@nestjs/common';
import * as positionRepositoryInterface from '../../domain/repositories/position.repository.interface.js';
import { CreatePositionDto } from '../dtos/create-position.dto.js';

@Injectable()
export class CreatePositionUseCase {
    constructor(@Inject(positionRepositoryInterface.POSITION_REPOSITORY) private readonly repository: positionRepositoryInterface.IPositionRepository) { }
    async execute(dto: CreatePositionDto) { return this.repository.create(dto); }
}