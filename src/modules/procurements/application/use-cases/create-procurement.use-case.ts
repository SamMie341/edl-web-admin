import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as procurementRepositoryInterface from '../../domain/repositories/procurement.repository.interface.js';
import { CreateProcurementDto } from '../dtos/create-procurement.dto.js';

@Injectable()
export class CreateProcurementUseCase {
    constructor(@Inject(procurementRepositoryInterface.PROCUREMENT_REPOSITORY) private readonly repository: procurementRepositoryInterface.IProcurementRepository) { }
    async execute(dto: CreateProcurementDto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);

        if (endDate < startDate) {
            throw new BadRequestException('ວັນທີສິ້ນສຸດ ຕ້ອງຫຼາຍກວ່າ ຫຼື ເທົ່າກັບວັນທີເລີ່ມຕົ້ນ');
        }

        const dataToSave = {
            ...dto,
            startDate,
            endDate,
        };
        return this.repository.create(dataToSave);
    }
}