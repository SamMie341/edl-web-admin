import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateLegislationUseCase } from './application/use-cases/create-legislation.use-case.js';
import { DeleteLegislationUseCase } from './application/use-cases/delete-legislation.use-case.js';
import { GetLegislationByIdUseCase } from './application/use-cases/get-legislation-by-id.use-case.js';
import { GetLegislationsUseCase } from './application/use-cases/get-legislation.use-case.js';
import { UpdateLegislationUseCase } from './application/use-cases/update-legislation.use-case.js';
import { UploadLegislationFileUseCase } from './application/use-cases/upload-legislation-file.use-case.js';
import { LEGISLATION_REPOSITORY } from './domain/repositories/legislation.repository.js';
import { PrismaLegislationRepository } from './infrastructure/database/prisma-legislation.repository.js';
import { LegislationsController } from './presentation/legislations.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [LegislationsController],
  providers: [
    CreateLegislationUseCase,
    UpdateLegislationUseCase,
    DeleteLegislationUseCase,
    GetLegislationsUseCase,
    GetLegislationByIdUseCase,
    UploadLegislationFileUseCase,
    {
      provide: LEGISLATION_REPOSITORY,
      useClass: PrismaLegislationRepository,
    },
  ],
})
export class LegislationsModule { }