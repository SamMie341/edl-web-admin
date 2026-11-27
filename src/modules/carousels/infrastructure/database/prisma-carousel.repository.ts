import { Injectable } from "@nestjs/common";
import { CreateCarouselData, ICarouselRepository, UpdateCarouselData } from "../../domain/repositories/carousel.repository.interface.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import { Carousel } from "../../../../generated/prisma/client.js";
import { CommonStatus } from "../../../../generated/prisma/enums.js";

@Injectable()
export class PrismaCarouselRepository implements ICarouselRepository {
    constructor(private readonly prisma: PrismaService) { }


    async findAll(status?: CommonStatus): Promise<Carousel[]> {
        return this.prisma.carousel.findMany({
            where: status ? { status } : undefined,
            orderBy: [{ orderIndex: 'asc' }, { id: 'desc' }],
        });
    }
    async findById(id: number): Promise<Carousel | null> {
        return this.prisma.carousel.findUnique({
            where: { id },
        })
    }
    async create(data: CreateCarouselData): Promise<Carousel> {
        return this.prisma.carousel.create({ data });
    }
    async update(id: number, data: UpdateCarouselData): Promise<Carousel> {
        return this.prisma.carousel.update({
            where: { id },
            data,
        });
    }
    async delete(id: number): Promise<Carousel> {
        return this.prisma.carousel.delete({
            where: { id },
        })
    }
}