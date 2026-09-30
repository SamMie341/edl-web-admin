import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as electricityTariffRepositoryInterface from '../../domain/repositories/electricity-tariff.repository.interface.js';

@Injectable()
export class GetElectricityTariffByIdUseCase {
    constructor(@Inject(electricityTariffRepositoryInterface.ELECTRICITY_TARIFF_REPOSITORY) private readonly repository: electricityTariffRepositoryInterface.IElectricityTariffRepository) { }
    async execute(id: number) {
        const tariff = await this.repository.findById(id);
        if (!tariff) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນລາຄາໄຟຟ້າ');
        return tariff;
    }
}