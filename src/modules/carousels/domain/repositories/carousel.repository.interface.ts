import { Carousel } from "../../../../generated/prisma/client.js";
import { CommonStatus } from "../../../../generated/prisma/enums.js";

export const CAROUSEL_REPOSITORY = 'CAROUSEL_REPOSITORY';

export interface CreateCarouselData {
    imageUrl: string;
    orderIndex?: number;
    status?: CommonStatus;
}

export interface UpdateCarouselData {
    imageUrl?: string;
    orderIndex?: number;
    status?: CommonStatus;
}

export interface ICarouselRepository {
    findAll(status?: CommonStatus): Promise<Carousel[]>;
    findById(id: number): Promise<Carousel | null>;
    create(data: CreateCarouselData): Promise<Carousel>;
    update(id: number, data: UpdateCarouselData): Promise<Carousel>;
    delete(id: number): Promise<Carousel>;
}