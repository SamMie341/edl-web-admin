import { Injectable, Inject } from '@nestjs/common';
import * as electricityTariffRepositoryInterface from '../../domain/repositories/electricity-tariff.repository.interface.js';

@Injectable()
export class GetElectricityTariffsUseCase {
    constructor(@Inject(electricityTariffRepositoryInterface.ELECTRICITY_TARIFF_REPOSITORY) private readonly repository: electricityTariffRepositoryInterface.IElectricityTariffRepository) { }
    async execute(search?: string, page: number = 1, limit: number = 10) {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
        return this.repository.findAll(search, validPage, validLimit);
    }
}