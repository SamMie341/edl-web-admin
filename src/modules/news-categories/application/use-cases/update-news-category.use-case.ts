import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as newsCategoryRepositoryInterface from '../../domain/repositories/news-category.repository.interface.js';
import { UpdateNewsCategoryDto } from '../dtos/update-news-category.dto.js';

@Injectable()
export class UpdateNewsCategoryUseCase {
    constructor(@Inject(newsCategoryRepositoryInterface.NEWS_CATEGORY_REPOSITORY) private readonly repository: newsCategoryRepositoryInterface.INewsCategoryRepository) { }
    async execute(id: number, dto: UpdateNewsCategoryDto) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບໝວດໝູ່ຂ່າວສານ');
        return this.repository.update(id, dto);
    }
}