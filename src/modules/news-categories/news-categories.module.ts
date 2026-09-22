import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateNewsCategoryUseCase } from './application/use-cases/create-news-category.use-case.js';
import { DeleteNewsCategoryUseCase } from './application/use-cases/delete-news-category.use-case.js';
import { GetNewsCategoryByIdUseCase } from './application/use-cases/get-news-category-by-id.use-case.js';
import { GetNewsCategoriesUseCase } from './application/use-cases/get-news-category.use-case.js';
import { UpdateNewsCategoryUseCase } from './application/use-cases/update-news-category.use-case.js';
import { NEWS_CATEGORY_REPOSITORY } from './domain/repositories/news-category.repository.interface.js';
import { PrismaNewsCategoryRepository } from './infrastructure/database/prisma-news-category.repository.js';
import { NewsCategoriesController } from './presentation/news-categories.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [NewsCategoriesController],
    providers: [
        CreateNewsCategoryUseCase,
        UpdateNewsCategoryUseCase,
        DeleteNewsCategoryUseCase,
        GetNewsCategoriesUseCase,
        GetNewsCategoryByIdUseCase,
        {
            provide: NEWS_CATEGORY_REPOSITORY,
            useClass: PrismaNewsCategoryRepository,
        },
    ],
})
export class NewsCategoriesModule { }