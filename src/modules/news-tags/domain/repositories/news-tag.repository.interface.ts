import { NewsTag } from "../../../../generated/prisma/client.js";

export const NEWS_TAG_REPOSITORY = 'NEWS_TAG_REPOSITORY';
export interface INewsTagRepository {
    findAll(): Promise<NewsTag[]>;
    findById(id: number): Promise<NewsTag | null>;
    findByNames(name: string[]): Promise<NewsTag[]>;
    create(data: any): Promise<NewsTag>;
    update(id: number, data: any): Promise<NewsTag>;
    delete(id: number): Promise<NewsTag>;
}