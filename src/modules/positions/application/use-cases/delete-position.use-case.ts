import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as positionRepositoryInterface from '../../domain/repositories/position.repository.interface.js';

@Injectable()
export class DeletePositionUseCase {
    constructor(@Inject(positionRepositoryInterface.POSITION_REPOSITORY) private readonly repository: positionRepositoryInterface.IPositionRepository) { }
    async execute(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຕຳແໜ່ງງານ');
        return this.repository.delete(id);
    }
}