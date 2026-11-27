import { Inject, Injectable } from "@nestjs/common";
import * as carouselRepositoryInterface from "../../domain/repositories/carousel.repository.interface.js";
import { CommonStatus } from "../../../../generated/prisma/enums.js";

@Injectable()
export class GetCarouselsUseCase {
    constructor(
        @Inject(carouselRepositoryInterface.CAROUSEL_REPOSITORY)
        private readonly repo: carouselRepositoryInterface.ICarouselRepository,
    ) { }

    async execute(status?: CommonStatus) {
        return this.repo.findAll(status);
    }
}