import { Injectable, Inject } from '@nestjs/common';
import * as newsCategoryRepositoryInterface from '../../domain/repositories/news-category.repository.interface.js';

@Injectable()
export class GetNewsCategoriesUseCase {
    constructor(@Inject(newsCategoryRepositoryInterface.NEWS_CATEGORY_REPOSITORY) private readonly repository: newsCategoryRepositoryInterface.INewsCategoryRepository) { }
    async execute() { return this.repository.findAll(); }
}