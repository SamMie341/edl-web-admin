import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as carouselRepositoryInterface from "../../domain/repositories/carousel.repository.interface.js";

@Injectable()
export class GetCarouselByIdUseCase {
    constructor(
        @Inject(carouselRepositoryInterface.CAROUSEL_REPOSITORY)
        private readonly repo: carouselRepositoryInterface.ICarouselRepository,
    ) { }

    async execute(id: number) {
        const data = await this.repo.findById(id);
        if (!data) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນ Carousel');
        return data;
    }
}