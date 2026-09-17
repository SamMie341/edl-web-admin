import { Injectable } from "@nestjs/common";
import { IProvinceRepository } from "../../domain/repositories/province.repository.interface.js";
import { Province } from "../../../../generated/prisma/client.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class PrismaProvinceRepository implements IProvinceRepository {
    constructor(private readonly prisma: PrismaService) { }
    async findAll(includeDistricts?: boolean): Promise<Province[]> {
        return this.prisma.province.findMany({
            include: includeDistricts ? { disctricts: { orderBy: { id: 'asc' } } } : undefined,
            orderBy: { id: 'asc' },
        });
    }

    async upsert(id: number, data: any): Promise<Province> {
        return this.prisma.province.upsert({
            where: { id },
            update: data,
            create: { id, ...data },
        });
    }
}