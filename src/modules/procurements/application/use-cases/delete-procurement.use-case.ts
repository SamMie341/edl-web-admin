import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as procurementRepositoryInterface from '../../domain/repositories/procurement.repository.interface.js';

@Injectable()
export class DeleteProcurementUseCase {
    constructor(@Inject(procurementRepositoryInterface.PROCUREMENT_REPOSITORY) private readonly repository: procurementRepositoryInterface.IProcurementRepository) { }
    async execute(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນການປະມູນ');
        return this.repository.delete(id);
    }
}