import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as electricityTariffRepositoryInterface from '../../domain/repositories/electricity-tariff.repository.interface.js';

@Injectable()
export class UploadElectricityTariffFilesUseCase {
    constructor(@Inject(electricityTariffRepositoryInterface.ELECTRICITY_TARIFF_REPOSITORY) private readonly repository: electricityTariffRepositoryInterface.IElectricityTariffRepository) { }

    async execute(id: number, fileType: 'imageUrl' | 'pdfUrl', filePath: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນລາຄາໄຟຟ້າ');
        return this.repository.update(id, { [fileType]: filePath });
    }
}