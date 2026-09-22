import { Injectable } from '@nestjs/common';
import { INewsCategoryRepository } from '../../domain/repositories/news-category.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { NewsCategory } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaNewsCategoryRepository implements INewsCategoryRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<NewsCategory[]> {
        return this.prisma.newsCategory.findMany({
            orderBy: { orderIndex: 'asc' }, // ລຽງລຳດັບຕາມ orderIndex
        });
    }

    async findById(id: number): Promise<NewsCategory | null> {
        return this.prisma.newsCategory.findUnique({
            where: { id },
        });
    }

    async create(data: any): Promise<NewsCategory> {
        return this.prisma.newsCategory.create({ data });
    }

    async update(id: number, data: any): Promise<NewsCategory> {
        return this.prisma.newsCategory.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<NewsCategory> {
        return this.prisma.newsCategory.delete({
            where: { id },
        });
    }
}