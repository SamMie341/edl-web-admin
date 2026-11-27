import { Inject, Injectable } from "@nestjs/common";
import { removeUploadedFile } from "../../../../core/utils/file-upload.utils.js";
import * as carouselRepositoryInterface from "../../domain/repositories/carousel.repository.interface.js";
import { CreateCarouselDto } from "../dtos/create-carousel.dto.js";

@Injectable()
export class CreateCarouselUseCase {
    constructor(
        @Inject(carouselRepositoryInterface.CAROUSEL_REPOSITORY)
        private readonly repo: carouselRepositoryInterface.ICarouselRepository,
    ) { }

    async execute(imageUrl: string, dto: CreateCarouselDto) {
        try {
            return await this.repo.create({
                imageUrl,
                orderIndex: dto.orderIndex,
                status: dto.status,
            });
        } catch (err) {
            removeUploadedFile(imageUrl);
            throw err;
        }
    }
}