import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as procurementRepositoryInterface from '../../domain/repositories/procurement.repository.interface.js';

@Injectable()
export class UploadProcurementFilesUseCase {
    constructor(@Inject(procurementRepositoryInterface.PROCUREMENT_REPOSITORY) private readonly repository: procurementRepositoryInterface.IProcurementRepository) { }

    async execute(id: number, fileType: 'imageUrl' | 'fileUrl', filePath: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນການປະມູນ');
        return this.repository.update(id, { [fileType]: filePath });
    }
}