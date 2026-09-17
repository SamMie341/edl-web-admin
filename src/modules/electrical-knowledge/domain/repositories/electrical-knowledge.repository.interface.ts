import { ElectricalKnowledge } from "../../../../generated/prisma/client.js";

export const ELECTRICAL_KNOWLEDGE_REPOSITORY = 'ELECTRICAL_KNOWLEDGE_REPOSITORY';

export interface IElectricalKnowledgeRepository {
    findAll(): Promise<ElectricalKnowledge[]>;
    findById(id: number): Promise<ElectricalKnowledge | null>;
    create(data: any): Promise<ElectricalKnowledge>;
    update(id: number, data: any): Promise<ElectricalKnowledge>;
    delete(id: number): Promise<ElectricalKnowledge>;
    incrementViewCount(id: number): Promise<ElectricalKnowledge>;
}