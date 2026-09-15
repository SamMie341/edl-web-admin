import { Injectable } from '@nestjs/common';
import { IBranchRepository } from '../../domain/repositories/branch.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { Branch } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaBranchRepository implements IBranchRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number): Promise<Branch | null> {
        return this.prisma.branch.findUnique({
            where: { id },
            include: { department: true }
        });
    }

    async create(data: any): Promise<Branch> {
        return await this.prisma.branch.create({ data });
    }

    async update(id: number, data: any): Promise<Branch> {
        return await this.prisma.branch.update({
            where: { id },
            data
        });
    }
    async delete(id: number): Promise<Branch> {
        return await this.prisma.branch.delete({ where: { id } });
    }

    async findAll(): Promise<Branch[]> {
        // ດຶງຂໍ້ມູນສາຂາ ພ້ອມກັບຊື່ຝ່າຍ (Department)
        return this.prisma.branch.findMany({
            include: { department: true },
            orderBy: { orderIndex: 'asc' },
        });
    }

    async upsert(id: number, data: any): Promise<Branch> {
        // ໃຊ້ upsert ເພື່ອສ້າງໃໝ່ຖ້າຍັງບໍ່ມີ (ໂດຍອ້າງອີງ id ເດີມ) ຫຼື ອັບເດດຖ້າມີແລ້ວ
        return this.prisma.branch.upsert({
            where: { id },
            update: data,
            create: { id, ...data },
        });
    }
}