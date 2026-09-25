import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as newsRepositoryInterface from '../../domain/repositories/news.repository.interface.js';
import { UpdateNewsDto } from '../dtos/update-news.dto.js';

@Injectable()
export class UpdateNewsUseCase {
    constructor(@Inject(newsRepositoryInterface.NEWS_REPOSITORY) private readonly repository: newsRepositoryInterface.INewsRepository) { }
    async execute(id: number, dto: UpdateNewsDto) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂ່າວສານ');

        const { tagIds, ...newsData } = dto;
        const dataToUpdate = {
            ...newsData,
            ...(newsData.publishedAt && { publishedAt: new Date(newsData.publishedAt) }),
        };

        return this.repository.update(id, dataToUpdate, tagIds);
    }
}