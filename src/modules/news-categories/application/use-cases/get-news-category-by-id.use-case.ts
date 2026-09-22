import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as newsCategoryRepositoryInterface from '../../domain/repositories/news-category.repository.interface.js';

@Injectable()
export class GetNewsCategoryByIdUseCase {
    constructor(@Inject(newsCategoryRepositoryInterface.NEWS_CATEGORY_REPOSITORY) private readonly repository: newsCategoryRepositoryInterface.INewsCategoryRepository) { }
    async execute(id: number) {
        const category = await this.repository.findById(id);
        if (!category) throw new NotFoundException('ບໍ່ພົບໝວດໝູ່ຂ່າວສານ');
        return category;
    }
}