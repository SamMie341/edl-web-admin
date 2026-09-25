import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { News } from '../../../../generated/prisma/client.js';
import { INewsRepository } from '../../domain/repositories/news.repository.interface.js';

@Injectable()
export class PrismaNewsRepository implements INewsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async assignTags(newsId: number, tagIds: number[]): Promise<News> {
        // ໃຊ້ Transaction ເພື່ອຮັບປະກັນວ່າການລຶບຂອງເກົ່າແລະໃສ່ຂອງໃໝ່ຈະເຮັດວຽກພ້ອມກັນ
        return this.prisma.$transaction(async (tx) => {
            // 1. ລຶບ Tag ເກົ່າທີ່ເຄີຍແນບໄວ້ອອກໃຫ້ໝົດກ່ອນ (ເພື່ອປ້ອງກັນການຊໍ້າຊ້ອນ)
            await tx.newsTagRelation.deleteMany({
                where: { newsId },
            });

            // 2. ຖ້າມີການສົ່ງ tagIds ມາໃໝ່ ໃຫ້ທຳການເພີ່ມເຂົ້າໄປ
            if (tagIds && tagIds.length > 0) {
                const relations = tagIds.map(tagId => ({
                    newsId,
                    tagId,
                }));

                await tx.newsTagRelation.createMany({
                    data: relations,
                });
            }

            // 3. ດຶງຂໍ້ມູນຂ່າວພ້ອມກັບ Tag ທີ່ອັບເດດແລ້ວສົ່ງກັບໄປ
            return tx.news.findUnique({
                where: { id: newsId },
                include: { tags: { include: { tag: true } } },
            }) as unknown as News; // type assertion ເພາະ Prisma ອາດຈະສົງໄສ type ຂອງ include
        });
    }

    async findAll(): Promise<News[]> {
        return this.prisma.news.findMany({
            include: { category: true, tags: { include: { tag: true } } },
            orderBy: { createdAt: 'desc' },
        }) as unknown as News[];
    }

    async findById(id: number): Promise<News | null> {
        return this.prisma.news.findUnique({
            where: { id },
            include: { category: true, tags: { include: { tag: true } } },
        }) as unknown as News | null;
    }

    async create(data: any, tagIds?: number[]): Promise<News> {
        return this.prisma.$transaction(async (tx) => {
            const news = await tx.news.create({ data });

            if (tagIds && tagIds.length > 0) {
                const relations = tagIds.map(tagId => ({
                    newsId: news.id,
                    tagId,
                }));

                await tx.newsTagRelation.createMany({
                    data: relations,
                });
            }

            return tx.news.findUnique({
                where: { id: news.id },
                include: { category: true, tags: { include: { tag: true } } },
            }) as unknown as News;
        });
    }

    async update(id: number, data: any, tagIds?: number[]): Promise<News> {
        return this.prisma.$transaction(async (tx) => {
            if (tagIds !== undefined) {
                await tx.newsTagRelation.deleteMany({
                    where: { newsId: id },
                });

                if (tagIds.length > 0) {
                    const relations = tagIds.map(tagId => ({
                        newsId: id,
                        tagId,
                    }));

                    await tx.newsTagRelation.createMany({
                        data: relations,
                    });
                }
            }

            await tx.news.update({
                where: { id },
                data,
            });

            return tx.news.findUnique({
                where: { id },
                include: { category: true, tags: { include: { tag: true } } },
            }) as unknown as News;
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