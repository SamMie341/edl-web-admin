import { Injectable } from "@nestjs/common";
import { INewsTagRepository } from "../../domain/repositories/news-tag.repository.interface.js";
import { NewsTag } from "../../../../generated/prisma/client.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class PrismaNewsTagRepository implements INewsTagRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<NewsTag[]> {
        return this.prisma.newsTag.findMany({
            orderBy: {
                tagName: 'asc'
            }
        });
    }

    async findById(id: number): Promise<NewsTag | null> {
        return this.prisma.newsTag.findUnique({
            where: { id }
        });
    }

    async findByNames(name: string[]): Promise<NewsTag[]> {
        return this.prisma.newsTag.findMany({
            where: { tagName: { in: name } }
        })
    }

    async create(data: any): Promise<NewsTag> {
        return this.prisma.newsTag.create({ data });
    }

    async update(id: number, data: any): Promise<NewsTag> {
        return this.prisma.newsTag.update({ where: { id }, data });
    }

    async delete(id: number): Promise<NewsTag> {
        return this.prisma.newsTag.delete({ where: { id } });
    }
}