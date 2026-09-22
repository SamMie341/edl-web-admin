import { Injectable, Inject } from '@nestjs/common';
import * as magazineRepositoryInterface from '../../domain/repositories/magazine.repository.interface.js';
import { CreateMagazineDto } from '../dtos/create-magazine.dto.js';

@Injectable()
export class CreateMagazineUseCase {
    constructor(@Inject(magazineRepositoryInterface.MAGAZINE_REPOSITORY) private readonly repository: magazineRepositoryInterface.IMagazineRepository) { }
    async execute(dto: CreateMagazineDto) {
        // ຖ້າມີການສົ່ງວັນທີມາ ໃຫ້ແປງເປັນ Date Object ກ່ອນບັນທຶກ
        const dataToSave = {
            ...dto,
            publishedDate: dto.publishedDate ? new Date(dto.publishedDate) : null,
            // ຖ້າ Frontend ບໍ່ໄດ້ສົ່ງ fileUrl ມາຕອນສ້າງ (ບັງຄັບໃນ Schema) ເຮົາອາດຈະໃສ່ຄ່າວ່າງໄວ້ກ່ອນ
            fileUrl: dto.fileUrl || '',
        };
        return this.repository.create(dataToSave);
    }
}