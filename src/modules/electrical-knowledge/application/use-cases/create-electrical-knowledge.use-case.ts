import { Inject, Injectable } from "@nestjs/common";
import * as electricalKnowledgeRepositoryInterface from "../../domain/repositories/electrical-knowledge.repository.interface.js";
import { CreateElectricalKnowledgeDto } from "../dtos/create-electrical-knowledge.dto.js";

@Injectable()
export class CreateElectricalKnowledgeUseCase {
    constructor(
        @Inject(electricalKnowledgeRepositoryInterface.ELECTRICAL_KNOWLEDGE_REPOSITORY) private readonly repo: electricalKnowledgeRepositoryInterface.IElectricalKnowledgeRepository,
    ) { }

    async execute(dto: CreateElectricalKnowledgeDto) {
        return this.repo.create(dto);
    }
}