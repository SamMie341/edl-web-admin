import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as electricalKnowledgeRepositoryInterface from "../../../electrical-knowledge/domain/repositories/electrical-knowledge.repository.interface.js";

@Injectable()
export class IncrementElectricalKnowledgeViewUseCase {
    constructor(@Inject(electricalKnowledgeRepositoryInterface.ELECTRICAL_KNOWLEDGE_REPOSITORY) private readonly repo: electricalKnowledgeRepositoryInterface.IElectricalKnowledgeRepository) { }

    async execute(id: number) {
        const article = await this.repo.findById(id);
        if (!article) throw new NotFoundException('ບໍ່ພົບບົດຄວາມ');
        return this.repo.incrementViewCount(id);
    }
}