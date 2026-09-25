import { News } from "../../../../generated/prisma/client.js";

export const NEWS_REPOSITORY = 'NEWS_REPOSITORY';

export interface INewsRepository {
    findAll(): Promise<News[]>;
    findById(id: number): Promise<News | null>;
    create(data: any, tagIds?: number[]): Promise<News>;
    update(id: number, data: any, tagIds?: number[]): Promise<News>;
    delete(id: number): Promise<News>;
    incrementViewCount(id: number): Promise<News>;
    assignTags(newId: number, tagIds: number[]): Promise<News>;
}