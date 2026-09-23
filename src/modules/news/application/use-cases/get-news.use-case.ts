import { Injectable, Inject } from '@nestjs/common';
import * as newsRepositoryInterface from '../../domain/repositories/news.repository.interface.js';

@Injectable()
export class GetNewsUseCase {
    constructor(@Inject(newsRepositoryInterface.NEWS_REPOSITORY) private readonly repository: newsRepositoryInterface.INewsRepository) { }
    async execute() { return this.repository.findAll(); }
}