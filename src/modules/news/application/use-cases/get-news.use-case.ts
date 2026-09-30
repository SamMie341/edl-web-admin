import { Injectable, Inject } from '@nestjs/common';
import * as newsRepositoryInterface from '../../domain/repositories/news.repository.interface.js';

@Injectable()
export class GetNewsUseCase {
    constructor(@Inject(newsRepositoryInterface.NEWS_REPOSITORY) private readonly repository: newsRepositoryInterface.INewsRepository) { }
    async execute(search?: string, page: number = 1, limit: number = 10) {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
        return this.repository.findAll(search, validPage, validLimit);
    }
}