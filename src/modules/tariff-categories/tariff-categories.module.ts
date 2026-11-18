import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateTariffCategoryUseCase } from './application/use-cases/create-tariff-category.use-case.js';
import { DeleteTariffCategoryUseCase } from './application/use-cases/delete-tariff-category.use-case.js';
import { GetTariffCategoriesUseCase } from './application/use-cases/get-tariff-categories.use-case.js';
import { GetTariffCategoryByIdUseCase } from './application/use-cases/get-tariff-category-by-id.use-case.js';
import { UpdateTariffCategoryUseCase } from './application/use-cases/update-tariff-category.use-case.js';
import { TARIFF_CATEGORY_REPOSITORY } from './domain/repositories/tariff-category.repository.interface.js';
import { PrismaTariffCategoryRepository } from './infrastructure/database/prisma-tariff-category.repository.js';
import { TariffCategoriesController } from './presentation/tariff-categories.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [TariffCategoriesController],
    providers: [
        GetTariffCategoriesUseCase,
        GetTariffCategoryByIdUseCase,
        CreateTariffCategoryUseCase,
        UpdateTariffCategoryUseCase,
        DeleteTariffCategoryUseCase,
        {
            provide: TARIFF_CATEGORY_REPOSITORY,
            useClass: PrismaTariffCategoryRepository,
        },
    ],
    exports: [TARIFF_CATEGORY_REPOSITORY],
})
export class TariffCategoriesModule { }
