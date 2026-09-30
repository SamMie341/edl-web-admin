import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as positionRepositoryInterface from '../../domain/repositories/position.repository.interface.js';


@Injectable()
export class GetPositionByIdUseCase {
    constructor(@Inject(positionRepositoryInterface.POSITION_REPOSITORY) private readonly repository: positionRepositoryInterface.IPositionRepository) { }
    async execute(id: number) {
        const position = await this.repository.findById(id);
        if (!position) throw new NotFoundException('ບໍ່ພົບຕຳແໜ່ງງານ');
        return position;
    }
}