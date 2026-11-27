import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { CarouselsController } from "./presentation/carousel.controller.js";
import { CreateCarouselUseCase } from "./application/use-cases/create-carousel.use-case.js";
import { GetCarouselsUseCase } from "./application/use-cases/get-carousels.use-case.js";
import { GetCarouselByIdUseCase } from "./application/use-cases/get-carousel-by-id.use-case.js";
import { UpdateCarouselUseCase } from "./application/use-cases/update-carousel.use-case.js";
import { DeleteCarouselUseCase } from "./application/use-cases/delete-carousel.use-case.js";
import { CAROUSEL_REPOSITORY } from "./domain/repositories/carousel.repository.interface.js";
import { PrismaCarouselRepository } from "./infrastructure/database/prisma-carousel.repository.js";

@Module({
    imports: [PrismaModule],
    controllers: [CarouselsController],
    providers: [
        CreateCarouselUseCase,
        GetCarouselsUseCase,
        GetCarouselByIdUseCase,
        UpdateCarouselUseCase,
        DeleteCarouselUseCase,
        {
            provide: CAROUSEL_REPOSITORY,
            useClass: PrismaCarouselRepository,
        }
    ]
})
export class CarouselsModule { }