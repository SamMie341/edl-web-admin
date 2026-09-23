import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateNewsUseCase } from './application/use-cases/create-news.use-case.js';
import { DeleteNewsUseCase } from './application/use-cases/delete-news.use-case.js';
import { GetNewsByIdUseCase } from './application/use-cases/get-news-by-id.use-case.js';
import { GetNewsUseCase } from './application/use-cases/get-news.use-case.js';
import { IncrementNewsViewUseCase } from './application/use-cases/increment-news-view.use-case.js';
import { UpdateNewsUseCase } from './application/use-cases/update-news.use-case.js';
import { UploadNewsImagesUseCase } from './application/use-cases/upload-news-images.use-case.js';
import { NEWS_REPOSITORY } from './domain/repositories/news.repository.interface.js';
import { PrismaNewsRepository } from './infrastructure/database/prisma-news.repository.js';
import { NewsController } from './presentation/news.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [NewsController],
    providers: [
        CreateNewsUseCase,
        UpdateNewsUseCase,
        DeleteNewsUseCase,
        GetNewsUseCase,
        GetNewsByIdUseCase,
        IncrementNewsViewUseCase,
        UploadNewsImagesUseCase,
        {
            provide: NEWS_REPOSITORY,
            useClass: PrismaNewsRepository,
        },
    ],
})
export class NewsModule { }