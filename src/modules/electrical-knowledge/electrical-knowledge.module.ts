import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateElectricalKnowledgeUseCase } from './application/use-cases/create-electrical-knowledge.use-case.js';
import { DeleteElectricalKnowledgeUseCase } from './application/use-cases/delete-electrical-knowledge.use-case.js';
import { GetElectricalKnowledgeByIdUseCase } from './application/use-cases/get-electrical-knowledge-by-id.use-case.js';
import { UpdateElectricalKnowledgeUseCase } from './application/use-cases/update-electrical-knowledge.use-case.js';
import { ELECTRICAL_KNOWLEDGE_REPOSITORY } from './domain/repositories/electrical-knowledge.repository.interface.js';
import { ElectricalKnowledgeController } from './presentation/electrical-knowledge.controller.js';
import { GetElectricalKnowledgeUseCase } from './application/use-cases/get-electrical-knowledge.use-case.js';
import { UploadElectricalKnowledgeUseCase } from './application/use-cases/upload-electrical-knowledge-image.use-case.js';
import { PrismaElectricalKnowlege } from './infrastructure/database/prisma-electrical-knowledge.repository.js';

@Module({
    imports: [PrismaModule],
    controllers: [ElectricalKnowledgeController],
    providers: [
        CreateElectricalKnowledgeUseCase,
        UpdateElectricalKnowledgeUseCase,
        DeleteElectricalKnowledgeUseCase,
        GetElectricalKnowledgeUseCase,
        GetElectricalKnowledgeByIdUseCase,
        UploadElectricalKnowledgeUseCase,
        {
            provide: ELECTRICAL_KNOWLEDGE_REPOSITORY,
            useClass: PrismaElectricalKnowlege,
        },
    ],
})
export class ElectricalKnowledgeModule { }