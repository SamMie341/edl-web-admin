import { Injectable } from '@nestjs/common';
import { IJobPostingRepository } from '../../domain/repositories/job-posting.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { JobPosting } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaJobPostingRepository implements IJobPostingRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string, page: number = 1, limit: number = 10): Promise<{ data: JobPosting[], meta: any }> {
        const skip = (page - 1) * limit;

        const whereCondition = search
            ? { title: { contains: search, mode: 'insensitive' } }
            : undefined;

        const [data, total] = await Promise.all([
            this.prisma.jobPosting.findMany({
                where: whereCondition as any,
                skip,
                take: limit,
                include: { position: true }, // ດຶງຂໍ້ມູນ Position ມາສະແດງນຳ
                orderBy: [
                    { endDate: 'asc' }, // ລຽງຕາມວັນທີໃກ້ປິດຮັບສະໝັກກ່ອນ
                    { createdAt: 'desc' },
                ],
            }),
            this.prisma.jobPosting.count({ where: whereCondition as any }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: { total, page, limit, totalPages },
        };
    }

    async findById(id: number): Promise<JobPosting | null> {
        return this.prisma.jobPosting.findUnique({
            where: { id },
            include: { position: true },
        });
    }

    async create(data: any): Promise<JobPosting> {
        return this.prisma.jobPosting.create({ data });
    }

    async update(id: number, data: any): Promise<JobPosting> {
        return this.prisma.jobPosting.update({ where: { id }, data });
    }

    async delete(id: number): Promise<JobPosting> {
        return this.prisma.jobPosting.delete({ where: { id } });
    }
}