import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreatePositionUseCase } from './application/use-cases/create-position.use-case.js';
import { DeletePositionUseCase } from './application/use-cases/delete-position.use-case.js';
import { GetPositionByIdUseCase } from './application/use-cases/get-position-by-id.use-case.js';
import { GetPositionsUseCase } from './application/use-cases/get-position.use-case.js';
import { UpdatePositionUseCase } from './application/use-cases/update-position.use-case.js';
import { POSITION_REPOSITORY } from './domain/repositories/position.repository.interface.js';
import { PrismaPositionRepository } from './infrastructure/database/prisma-position.repository.js';
import { PositionsController } from './presentation/positions.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [PositionsController],
    providers: [
        CreatePositionUseCase,
        UpdatePositionUseCase,
        DeletePositionUseCase,
        GetPositionsUseCase,
        GetPositionByIdUseCase,
        {
            provide: POSITION_REPOSITORY,
            useClass: PrismaPositionRepository,
        },
    ],
})
export class PositionsModule { }