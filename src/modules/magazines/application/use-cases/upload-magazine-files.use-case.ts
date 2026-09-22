import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as magazineRepositoryInterface from '../../domain/repositories/magazine.repository.interface.js';

@Injectable()
export class UploadMagazineFilesUseCase {
    constructor(@Inject(magazineRepositoryInterface.MAGAZINE_REPOSITORY) private readonly repository: magazineRepositoryInterface.IMagazineRepository) { }

    async execute(id: number, fileType: 'coverImage' | 'fileUrl', filePath: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນວາລະສານ');

        return this.repository.update(id, { [fileType]: filePath });
    }
}