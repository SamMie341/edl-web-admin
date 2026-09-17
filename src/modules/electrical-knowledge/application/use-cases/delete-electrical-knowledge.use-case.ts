import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as electricalKnowledgeRepositoryInterface from "../../domain/repositories/electrical-knowledge.repository.interface.js";

@Injectable()
export class DeleteElectricalKnowledgeUseCase {
    constructor(
        @Inject(electricalKnowledgeRepositoryInterface.ELECTRICAL_KNOWLEDGE_REPOSITORY)
        private readonly repo: electricalKnowledgeRepositoryInterface.IElectricalKnowledgeRepository,
    ) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບບົດຄວາມ');
        return this.repo.delete(id);
    }
}