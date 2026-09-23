import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as newsRepositoryInterface from '../../domain/repositories/news.repository.interface.js';

@Injectable()
export class DeleteNewsUseCase {
    constructor(@Inject(newsRepositoryInterface.NEWS_REPOSITORY) private readonly repository: newsRepositoryInterface.INewsRepository) { }
    async execute(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂ່າວສານ');
        return this.repository.delete(id);
    }
}