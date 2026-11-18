import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateApplianceCategoryUseCase } from './application/use-cases/create-appliance-category.use-case.js';
import { DeleteApplianceCategoryUseCase } from './application/use-cases/delete-appliance-category.use-case.js';
import { GetApplianceCategoriesUseCase } from './application/use-cases/get-appliance-categories.use-case.js';
import { GetApplianceCategoryByIdUseCase } from './application/use-cases/get-appliance-category-by-id.use-case.js';
import { UpdateApplianceCategoryUseCase } from './application/use-cases/update-appliance-category.use-case.js';
import { APPLIANCE_CATEGORY_REPOSITORY } from './domain/repositories/appliance-category.repository.interface.js';
import { PrismaApplianceCategoryRepository } from './infrastructure/database/prisma-appliance-category.repository.js';
import { ApplianceCategoriesController } from './presentation/appliance-categories.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [ApplianceCategoriesController],
    providers: [
        GetApplianceCategoriesUseCase,
        GetApplianceCategoryByIdUseCase,
        CreateApplianceCategoryUseCase,
        UpdateApplianceCategoryUseCase,
        DeleteApplianceCategoryUseCase,
        {
            provide: APPLIANCE_CATEGORY_REPOSITORY,
            useClass: PrismaApplianceCategoryRepository,
        },
    ],
    exports: [
        APPLIANCE_CATEGORY_REPOSITORY,
        GetApplianceCategoriesUseCase,
        GetApplianceCategoryByIdUseCase,
    ],
})
export class ApplianceCategoriesModule { }
