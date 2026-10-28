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
    private cleanCoordinates(data: any): any {
        if (!data) return data;
        const cleaned = { ...data };
        if (cleaned.longitude === '' || (typeof cleaned.longitude === 'string' && cleaned.longitude.trim() === '')) {
            cleaned.longitude = null;
        }
        if (cleaned.latitude === '' || (typeof cleaned.latitude === 'string' && cleaned.latitude.trim() === '')) {
            cleaned.latitude = null;
        }
        return cleaned;
    }

    async create(data: any): Promise<ServiceCenter> {
        const cleaned = this.cleanCoordinates(data);
        try {
            return await this.prisma.serviceCenter.create({
                data: cleaned
            });
        } catch (error: any) {
            if (error?.code === 'P2002' && (error?.meta?.modelName === 'ServiceCenter' || error?.message?.includes('service_centers_pkey'))) {
                await this.prisma.$executeRawUnsafe(
                    `SELECT setval(pg_get_serial_sequence('service_centers', 'id'), COALESCE((SELECT MAX(id) FROM service_centers), 1))`
                );
                return await this.prisma.serviceCenter.create({
                    data: cleaned
                });
            }
            throw error;
        }
    }

    async update(id: number, data: any): Promise<ServiceCenter> {
        return await this.prisma.serviceCenter.update({
            where: { id },
            data: this.cleanCoordinates(data)
        });
    }
    async delete(id: number): Promise<ServiceCenter> {
        return await this.prisma.serviceCenter.delete({ where: { id } });
    }

    async findAll(provinceId?: number): Promise<ServiceCenter[]> {
        return this.prisma.serviceCenter.findMany({
            where: provinceId ? { provinceId } : undefined,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                branch: {
                    select: {
                        id: true,
                        branchName: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                province: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                district: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                village: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
            orderBy: { provinceId: 'asc' },
        });
    }

    async upsert(id: number, data: any): Promise<ServiceCenter> {
        const cleaned = this.cleanCoordinates(data);
        return this.prisma.serviceCenter.upsert({
            where: { id },
            update: cleaned,
            create: { id, ...cleaned }
        });
    }
}