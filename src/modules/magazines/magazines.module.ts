import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { MagazinesController } from "./presentation/magazines.controller.js";
import { CreateMagazineUseCase } from "./application/use-cases/create-magazine.use-case.js";
import { UpdateMagazineUseCase } from "./application/use-cases/update-magazine.use-case.js";
import { DeleteMagazinUseCase } from "./application/use-cases/delete-magazine.use-case.js";
import { GetMagazinesUseCase } from "./application/use-cases/get-magazines.use-case.js";
import { GetMagazineByIdUseCase } from "./application/use-cases/get-magazine-by-id.use-case.js";
import { IncrementMagazineDownloadUseCase } from "./application/use-cases/increment-magazine-download.use-case.js";
import { UploadMagazineFilesUseCase } from "./application/use-cases/upload-magazine-files.use-case.js";
import { MAGAZINE_REPOSITORY } from "./domain/repositories/magazine.repository.interface.js";
import { PrismaMagazineRepository } from "./infrastructure/database/prisma-magazine.repository.js";

@Module({
    imports: [PrismaModule],
    controllers: [MagazinesController],
    providers: [
        CreateMagazineUseCase,
        UpdateMagazineUseCase,
        DeleteMagazinUseCase,
        GetMagazinesUseCase,
        GetMagazineByIdUseCase,
        IncrementMagazineDownloadUseCase,
        UploadMagazineFilesUseCase,
        {
            provide: MAGAZINE_REPOSITORY,
            useClass: PrismaMagazineRepository,
        }
    ]
})
export class MagazinesModule { }