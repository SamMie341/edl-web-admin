import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateJobPostingUseCase } from './application/use-cases/create-job-posting.use-case.js';
import { DeleteJobPostingUseCase } from './application/use-cases/delete-job-posting.use-case.js';
import { GetJobPostingByIdUseCase } from './application/use-cases/get-job-posting-by-id.use-case.js';
import { GetJobPostingsUseCase } from './application/use-cases/get-job-posting.use-case.js';
import { UpdateJobPostingUseCase } from './application/use-cases/update-job-posting.use-case.js';
import { JOB_POSTING_REPOSITORY } from './domain/repositories/job-posting.repository.interface.js';
import { PrismaJobPostingRepository } from './infrastructure/database/prisma-job-posting.repository.js';
import { JobPostingsController } from './presentation/job-postings.controller.js';
import { UploadJobPostingImageUseCase } from './application/use-cases/upload-job-posting-image.use-case.js';

@Module({
    imports: [PrismaModule],
    controllers: [JobPostingsController],
    providers: [
        CreateJobPostingUseCase,
        UpdateJobPostingUseCase,
        DeleteJobPostingUseCase,
        GetJobPostingsUseCase,
        GetJobPostingByIdUseCase,
        UploadJobPostingImageUseCase,
        {
            provide: JOB_POSTING_REPOSITORY,
            useClass: PrismaJobPostingRepository,
        },
    ],
})
export class JobPostingsModule { }