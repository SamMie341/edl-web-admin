import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { News } from '../../../../generated/prisma/client.js';
import { INewsRepository } from '../../domain/repositories/news.repository.interface.js';

@Injectable()
export class PrismaNewsRepository implements INewsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<News[]> {
        return this.prisma.news.findMany({
            include: { category: true, tags: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: number): Promise<News | null> {
        return this.prisma.news.findUnique({
            where: { id },
            include: { category: true, tags: true },
        });
    }

    async create(data: any): Promise<News> {
        return this.prisma.news.create({ data });
    }

    async update(id: number, data: any): Promise<News> {
        return this.prisma.news.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<News> {
        return this.prisma.news.delete({
            where: { id },
        });
    }

    async incrementViewCount(id: number): Promise<News> {
        return this.prisma.news.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }
}