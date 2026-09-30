import { Injectable, Inject } from '@nestjs/common';
import * as electricityTariffRepositoryInterface from '../../domain/repositories/electricity-tariff.repository.interface.js';
import { CreateElectricityTariffDto } from '../dtos/create-electricity-tariff.dto.js';

@Injectable()
export class CreateElectricityTariffUseCase {
    constructor(@Inject(electricityTariffRepositoryInterface.ELECTRICITY_TARIFF_REPOSITORY) private readonly repository: electricityTariffRepositoryInterface.IElectricityTariffRepository) { }
    async execute(dto: CreateElectricityTariffDto) {
        const dataToSave = {
            ...dto,
            effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : null,
        };
        return this.repository.create(dataToSave);
    }
}