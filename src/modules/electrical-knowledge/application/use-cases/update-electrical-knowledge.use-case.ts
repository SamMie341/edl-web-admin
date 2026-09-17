import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as electricalKnowledgeRepositoryInterface from "../../domain/repositories/electrical-knowledge.repository.interface.js";
import { UpdateElectricalKnowledgeDto } from "../dtos/update-electrical-knowledge.dto.js";

@Injectable()
export class UpdateElectricalKnowledgeUseCase {
    constructor(
        @Inject(electricalKnowledgeRepositoryInterface.ELECTRICAL_KNOWLEDGE_REPOSITORY)
        private readonly repo: electricalKnowledgeRepositoryInterface.IElectricalKnowledgeRepository,
    ) { }

    async execute(id: number, dto: UpdateElectricalKnowledgeDto) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບບົດຄວາມ');
        return this.repo.update(id, dto);
    }
}