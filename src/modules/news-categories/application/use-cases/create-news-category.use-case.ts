import { Injectable, Inject } from '@nestjs/common';
import * as newsCategoryRepositoryInterface from '../../domain/repositories/news-category.repository.interface.js';
import { CreateNewsCategoryDto } from '../dtos/create-news-category.dto.js';

@Injectable()
export class CreateNewsCategoryUseCase {
    constructor(@Inject(newsCategoryRepositoryInterface.NEWS_CATEGORY_REPOSITORY) private readonly repository: newsCategoryRepositoryInterface.INewsCategoryRepository) { }
    async execute(dto: CreateNewsCategoryDto) { return this.repository.create(dto); }
}