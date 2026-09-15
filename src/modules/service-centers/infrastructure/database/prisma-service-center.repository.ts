import { Injectable } from "@nestjs/common";
import { IServiceCenterRepository } from "../../domain/repositories/service-center.repository.interface.js";
import { ServiceCenter } from "../../../../generated/prisma/client.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class PrismaServiceCenterRepository implements IServiceCenterRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number): Promise<ServiceCenter | null> {
        return await this.prisma.serviceCenter.findUnique({ where: { id }, include: { province: true, district: true, village: true, department: true, branch: true } });

    }
    async create(data: any): Promise<ServiceCenter> {
        return await this.prisma.serviceCenter.create({
            data
        });
    }

    async update(id: number, data: any): Promise<ServiceCenter> {
        return await this.prisma.serviceCenter.update({
            where: { id },
            data
        })
    }
    async delete(id: number): Promise<ServiceCenter> {
        return await this.prisma.serviceCenter.delete({ where: { id } });
    }

    async findAll(): Promise<ServiceCenter[]> {
        return this.prisma.serviceCenter.findMany({
            include: {
                department: true,
                branch: true,
                province: true,
                district: true,
                village: true,
            },
            orderBy: { provinceId: 'asc' },
        });
    }

    async upsert(id: number, data: any): Promise<ServiceCenter> {
        return this.prisma.serviceCenter.upsert({
            where: { id },
            update: data,
            create: { id, ...data }
        });
    }
}