import { Injectable, Inject } from '@nestjs/common';
import * as newsRepositoryInterface from '../../domain/repositories/news.repository.interface.js';
import { CreateNewsDto } from '../dtos/create-news.dto.js';

@Injectable()
export class CreateNewsUseCase {
    constructor(@Inject(newsRepositoryInterface.NEWS_REPOSITORY) private readonly repository: newsRepositoryInterface.INewsRepository) { }
    async execute(dto: CreateNewsDto) {
        const dataToSave = {
            ...dto,
            publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
            galleryImages: dto.galleryImages || [], // ແປງເປັນ array ວ່າງຖ້າບໍ່ມີ
        };
        return this.repository.create(dataToSave);
    }
}