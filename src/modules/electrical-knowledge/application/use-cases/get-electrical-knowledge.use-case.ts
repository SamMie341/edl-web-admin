import { Inject, Injectable } from "@nestjs/common";
import * as electricalKnowledgeRepositoryInterface from "../../domain/repositories/electrical-knowledge.repository.interface.js";

@Injectable()
export class GetElectricalKnowledgeUseCase {
    constructor(
        @Inject(electricalKnowledgeRepositoryInterface.ELECTRICAL_KNOWLEDGE_REPOSITORY)
        private readonly repo: electricalKnowledgeRepositoryInterface.IElectricalKnowledgeRepository,
    ) { }

    async execute() {
        return this.repo.findAll();
    }
}