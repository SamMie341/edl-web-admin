import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { NewsTagsController } from "./presentation/news-tags.controller.js";
import { CreateNewsTagUseCase } from "./application/use-cases/create-news-tag.use-case.js";
import { UpdateNewsTagUseCase } from "./application/use-cases/update-news-tag.use-case.js";
import { DeleteNewsTagUseCase } from "./application/use-cases/delete-news-tag-use-case.js";
import { GetAllNewsTagUseCase } from "./application/use-cases/get-all-news-tag.use-case.js";
import { GetNewsTagByIdUseCase } from "./application/use-cases/get-by-id.use-case.js";
import { NEWS_TAG_REPOSITORY } from "./domain/repositories/news-tag.repository.interface.js";
import { PrismaNewsTagRepository } from "./infrastructure/database/prisma-news-tag.repository.js";

@Module({
    imports: [PrismaModule],
    controllers: [NewsTagsController],
    providers: [
        CreateNewsTagUseCase,
        UpdateNewsTagUseCase,
        DeleteNewsTagUseCase,
        GetAllNewsTagUseCase,
        GetNewsTagByIdUseCase,
        {
            provide: NEWS_TAG_REPOSITORY,
            useClass: PrismaNewsTagRepository,
        }
    ]
})

export class NewsTagModule { }