import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { removeUploadedFile } from "../../../../core/utils/file-upload.utils.js";
import * as carouselRepositoryInterface from "../../domain/repositories/carousel.repository.interface.js";
import { UpdateCarouselDto } from "../dtos/update-carousel.dto.js";

@Injectable()
export class UpdateCarouselUseCase {
    constructor(
        @Inject(carouselRepositoryInterface.CAROUSEL_REPOSITORY)
        private readonly repo: carouselRepositoryInterface.ICarouselRepository,
    ) { }

    async execute(id: number, dto: UpdateCarouselDto, newImageUrl?: string) {
        try {
            const existing = await this.repo.findById(id);
            if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນ Carousel');

            const updated = await this.repo.update(id, {
                ...dto,
                ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
            });

            if (newImageUrl && existing.imageUrl !== newImageUrl) {
                removeUploadedFile(existing.imageUrl);
            }

            return updated;
        } catch (err) {
            removeUploadedFile(newImageUrl);
            throw err;
        }
    }
}