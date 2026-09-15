import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { GetBranchesUseCase } from './application/use-cases/get-branches.use-case.js';
import { SyncBranchesUseCase } from './application/use-cases/sync-branches.use-case.js';
import { BRANCH_REPOSITORY } from './domain/repositories/branch.repository.interface.js';
import { LEGACY_BRANCH_SERVICE } from './domain/repositories/legacy-branch.service.interface.js';
import { PrismaBranchRepository } from './infrastructure/database/prisma-branch.repository.js';
import { LegacyBranchService } from './infrastructure/external/legacy-branch.service.js';
import { BranchesController } from './presentation/branches.controller.js';
import { CreateBranchUseCase } from './application/use-cases/create-branch.use-case.js';
import { UpdateBranchUseCase } from './application/use-cases/update-branch.use-case.js';
import { DeleteBranchUseCase } from './application/use-cases/delete-branch.use-case.js';
import { GetBranchByIdUseCase } from './application/use-cases/get-branch-by-id.use-case.js';
import { UploadBranchImageUseCase } from './application/use-cases/upload-branch-image.use-case.js';

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [BranchesController],
    providers: [
        SyncBranchesUseCase,
        GetBranchesUseCase,
        CreateBranchUseCase,
        UpdateBranchUseCase,
        DeleteBranchUseCase,
        GetBranchByIdUseCase,

        UploadBranchImageUseCase,
        {
            provide: BRANCH_REPOSITORY,
            useClass: PrismaBranchRepository,
        },
        {
            provide: LEGACY_BRANCH_SERVICE,
            useClass: LegacyBranchService,
        },
    ],
})
export class BranchesModule { }