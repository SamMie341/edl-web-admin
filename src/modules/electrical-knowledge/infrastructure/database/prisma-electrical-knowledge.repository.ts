import { Injectable } from "@nestjs/common";
import { IElectricalKnowledgeRepository } from "../../domain/repositories/electrical-knowledge.repository.interface.js";
import { ElectricalKnowledge } from "../../../../generated/prisma/client.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class PrismaElectricalKnowlege implements IElectricalKnowledgeRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<ElectricalKnowledge[]> {
        return this.prisma.electricalKnowledge.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id: number): Promise<ElectricalKnowledge | null> {
        return this.prisma.electricalKnowledge.findFirst({ where: { id } });
    }

    async create(data: any): Promise<ElectricalKnowledge> {
        return this.prisma.electricalKnowledge.create({ data });
    }

    async update(id: number, data: any): Promise<ElectricalKnowledge> {
        return this.prisma.electricalKnowledge.update({ where: { id }, data });
    }

    async delete(id: number): Promise<ElectricalKnowledge> {
        return this.prisma.electricalKnowledge.delete({ where: { id } });
    }

    async incrementViewCount(id: number): Promise<ElectricalKnowledge> {
        return this.prisma.electricalKnowledge.update({
            where: { id },
            data: { viewCount: { increment: 1 } }
        })
    }
}