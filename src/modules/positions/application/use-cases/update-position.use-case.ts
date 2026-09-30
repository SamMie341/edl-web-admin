import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as positionRepositoryInterface from '../../domain/repositories/position.repository.interface.js';
import { UpdatePositionDto } from '../dtos/update-position.dto.js';

@Injectable()
export class UpdatePositionUseCase {
    constructor(@Inject(positionRepositoryInterface.POSITION_REPOSITORY) private readonly repository: positionRepositoryInterface.IPositionRepository) { }
    async execute(id: number, dto: UpdatePositionDto) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຕຳແໜ່ງງານ');
        return this.repository.update(id, dto);
    }
}