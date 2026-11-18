import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateSavingTemplateUseCase } from './application/use-cases/create-saving-template.use-case.js';
import { DeleteSavingTemplateUseCase } from './application/use-cases/delete-saving-template.use-case.js';
import { GetSavingTemplatesUseCase } from './application/use-cases/get-saving-templates.use-case.js';
import { GetSavingTemplateByIdUseCase } from './application/use-cases/get-saving-template-by-id.use-case.js';
import { UpdateSavingTemplateUseCase } from './application/use-cases/update-saving-template.use-case.js';
import { SAVING_TEMPLATE_REPOSITORY } from './domain/repositories/saving-template.repository.interface.js';
import { PrismaSavingTemplateRepository } from './infrastructure/database/prisma-saving-template.repository.js';
import { SavingTemplatesController } from './presentation/saving-templates.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [SavingTemplatesController],
    providers: [
        GetSavingTemplatesUseCase,
        GetSavingTemplateByIdUseCase,
        CreateSavingTemplateUseCase,
        UpdateSavingTemplateUseCase,
        DeleteSavingTemplateUseCase,
        {
            provide: SAVING_TEMPLATE_REPOSITORY,
            useClass: PrismaSavingTemplateRepository,
        },
    ],
    exports: [
        SAVING_TEMPLATE_REPOSITORY,
        GetSavingTemplatesUseCase,
        GetSavingTemplateByIdUseCase,
    ],
})
export class SavingTemplatesModule { }
