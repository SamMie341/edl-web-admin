import { Injectable } from "@nestjs/common";
import { IVillageRepository } from "../../domain/repositories/village.repository.interface.js";
import { Village } from "../../../../generated/prisma/client.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class PrismaVillageRepository implements IVillageRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Village[]> {
        return this.prisma.village.findMany({
            include: { district: true },
            orderBy: { id: 'asc' }
        });
    }
    async upsert(id: number, data: any): Promise<Village> {
        return this.prisma.village.upsert({
            where: { id },
            update: data,
            create: { id, ...data },
        });
    }
}