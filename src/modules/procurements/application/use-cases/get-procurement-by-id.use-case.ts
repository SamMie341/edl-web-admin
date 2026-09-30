import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as procurementRepositoryInterface from '../../domain/repositories/procurement.repository.interface.js';

@Injectable()
export class GetProcurementByIdUseCase {
    constructor(@Inject(procurementRepositoryInterface.PROCUREMENT_REPOSITORY) private readonly repository: procurementRepositoryInterface.IProcurementRepository) { }
    async execute(id: number) {
        const procurement = await this.repository.findById(id);
        if (!procurement) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນການປະມູນ');
        return procurement;
    }
}