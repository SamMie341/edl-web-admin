import { Injectable } from "@nestjs/common";
import { IDistrictRepository } from "../../domain/repositories/district.repository.interface.js";
import { Disctrict } from "../../../../generated/prisma/client.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class PrismaDistrictRepository implements IDistrictRepository {
    constructor(private readonly prisma: PrismaService) { }
    async findAll(): Promise<Disctrict[]> {
        return this.prisma.disctrict.findMany({
            include: { province: true },
            orderBy: { id: 'asc' },
        });
    }
    async upsert(id: number, data: any): Promise<Disctrict> {
        return this.prisma.disctrict.upsert({
            where: { id },
            update: data,
            create: { id, ...data }
        });
    }
}