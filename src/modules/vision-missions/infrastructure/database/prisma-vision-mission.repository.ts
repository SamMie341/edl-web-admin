import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { VisionMission } from '../../../../generated/prisma/client.js';
import { IVisionMissionRepository } from '../../domain/repositories/vision-mission.repository.interface.js';

@Injectable()
export class PrismaVisionMissionRepository implements IVisionMissionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<VisionMission[]> {
        return this.prisma.visionMission.findMany({
            orderBy: [
                { entryType: 'asc' }, // ລຽງຕາມປະເພດກ່ອນ (Vision ມາກ່ອນ Mission)
                { orderIndex: 'asc' } // ຕາມດ້ວຍລຳດັບ
            ],
        });
    }

    async findById(id: number): Promise<VisionMission | null> {
        return this.prisma.visionMission.findUnique({
            where: { id },
        });
    }

    async create(data: any): Promise<VisionMission> {
        return this.prisma.visionMission.create({ data });
    }

    async update(id: number, data: any): Promise<VisionMission> {
        return this.prisma.visionMission.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<VisionMission> {
        return this.prisma.visionMission.delete({
            where: { id },
        });
    }
}