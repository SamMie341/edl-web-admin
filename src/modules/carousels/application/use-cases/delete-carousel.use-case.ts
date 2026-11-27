import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { removeUploadedFile } from "../../../../core/utils/file-upload.utils.js";
import * as carouselRepositoryInterface from "../../domain/repositories/carousel.repository.interface.js";

@Injectable()
export class DeleteCarouselUseCase {
    constructor(
        @Inject(carouselRepositoryInterface.CAROUSEL_REPOSITORY)
        private readonly repo: carouselRepositoryInterface.ICarouselRepository,
    ) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນ Carousel');

        const deleted = await this.repo.delete(id);
        removeUploadedFile(existing.imageUrl);
        return deleted;
    }
}