import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import * as procurementRepositoryInterface from '../../domain/repositories/procurement.repository.interface.js';
import { UpdateProcurementDto } from '../dtos/update-procurement.dto.js';

@Injectable()
export class UpdateProcurementUseCase {
    constructor(@Inject(procurementRepositoryInterface.PROCUREMENT_REPOSITORY) private readonly repository: procurementRepositoryInterface.IProcurementRepository) { }
    async execute(id: number, dto: UpdateProcurementDto) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນການປະມູນ');

        // ດຶງວັນທີເກົ່າມາປະສົມກັບວັນທີໃໝ່(ຖ້າມີ) ເພື່ອກວດສອບ Logic
        const startDate = dto.startDate ? new Date(dto.startDate) : existing.startDate;
        const endDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;

        if (endDate < startDate) {
            throw new BadRequestException('ວັນທີສິ້ນສຸດ ຕ້ອງຫຼາຍກວ່າ ຫຼື ເທົ່າກັບວັນທີເລີ່ມຕົ້ນ');
        }

        const dataToUpdate = {
            ...dto,
            ...(dto.startDate && { startDate: new Date(dto.startDate) }),
            ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        };

        return this.repository.update(id, dataToUpdate);
    }
}