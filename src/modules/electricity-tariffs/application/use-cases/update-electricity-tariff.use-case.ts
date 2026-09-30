import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as electricityTariffRepositoryInterface from '../../domain/repositories/electricity-tariff.repository.interface.js';
import { UpdateElectricityTariffDto } from '../dtos/update-electricity-tariff.dto.js';

@Injectable()
export class UpdateElectricityTariffUseCase {
    constructor(@Inject(electricityTariffRepositoryInterface.ELECTRICITY_TARIFF_REPOSITORY) private readonly repository: electricityTariffRepositoryInterface.IElectricityTariffRepository) { }
    async execute(id: number, dto: UpdateElectricityTariffDto) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນລາຄາໄຟຟ້າ');

        const dataToUpdate = {
            ...dto,
            ...(dto.effectiveDate && { effectiveDate: new Date(dto.effectiveDate) }),
        };

        return this.repository.update(id, dataToUpdate);
    }
}