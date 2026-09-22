import { NewsCategory } from "../../../../generated/prisma/client.js";


export const NEWS_CATEGORY_REPOSITORY = 'NEWS_CATEGORY_REPOSITORY';

export interface INewsCategoryRepository {
    findAll(): Promise<NewsCategory[]>;
    findById(id: number): Promise<NewsCategory | null>;
    create(data: any): Promise<NewsCategory>;
    update(id: number, data: any): Promise<NewsCategory>;
    delete(id: number): Promise<NewsCategory>;
}