import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as newsRepositoryInterface from '../../domain/repositories/news.repository.interface.js';

@Injectable()
export class UploadNewsImagesUseCase {
    constructor(@Inject(newsRepositoryInterface.NEWS_REPOSITORY) private readonly repository: newsRepositoryInterface.INewsRepository) { }

    async uploadCover(id: number, filePath: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂ່າວສານ');
        return this.repository.update(id, { coverImage: filePath });
    }

    async uploadGallery(id: number, filePaths: string[]) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂ່າວສານ');

        // ດຶງຮູບເກົ່າອອກມາ (ຖ້າມີ) ແລ້ວເອົາຮູບໃໝ່ໄປຕໍ່ທ້າຍ
        const currentGallery = existing.galleryImages ? (existing.galleryImages as string[]) : [];
        const updatedGallery = [...currentGallery, ...filePaths];

        return this.repository.update(id, { galleryImages: updatedGallery });
    }
}