import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as newsRepositoryInterface from '../../domain/repositories/news.repository.interface.js';

@Injectable()
export class GetNewsByIdUseCase {
    constructor(@Inject(newsRepositoryInterface.NEWS_REPOSITORY) private readonly repository: newsRepositoryInterface.INewsRepository) { }
    async execute(id: number) {
        const news = await this.repository.findById(id);
        if (!news) throw new NotFoundException('ບໍ່ພົບຂ່າວສານ');
        return news;
    }
}