import { Injectable } from '@nestjs/common';
import { IMagazineRepository } from '../../domain/repositories/magazine.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { Magazine } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaMagazineRepository implements IMagazineRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Magazine[]> {
        return this.prisma.magazine.findMany({
            orderBy: { publishedDate: 'desc' }, // ລຽງເອົາສະບັບໃໝ່ລ່າສຸດຂຶ້ນກ່ອນ
        });
    }

    async findById(id: number): Promise<Magazine | null> {
        return this.prisma.magazine.findUnique({ where: { id } });
    }

    async create(data: any): Promise<Magazine> {
        return this.prisma.magazine.create({ data });
    }

    async update(id: number, data: any): Promise<Magazine> {
        return this.prisma.magazine.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Magazine> {
        return this.prisma.magazine.delete({ where: { id } });
    }

    async incrementDownloadCount(id: number): Promise<Magazine> {
        return this.prisma.magazine.update({
            where: { id },
            data: { downloadCount: { increment: 1 } },
        });
    }
}