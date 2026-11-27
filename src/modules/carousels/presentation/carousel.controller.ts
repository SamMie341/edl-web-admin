import { diskStorage } from "multer";
import { join } from "path";
import * as fs from 'fs';
import { CleanupUploadedFileOnErrorInterceptor } from "../../../core/interceptors/cleanup-uploaded-file-on-error.interceptor.js";
import { editFileName, imageFileFilter } from "../../../core/utils/file-upload.utils.js";
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/presentation/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../../auth/presentation/guards/permissions.guard.js";
import { CreateCarouselUseCase } from "../application/use-cases/create-carousel.use-case.js";
import { GetCarouselsUseCase } from "../application/use-cases/get-carousels.use-case.js";
import { GetCarouselByIdUseCase } from "../application/use-cases/get-carousel-by-id.use-case.js";
import { UpdateCarouselUseCase } from "../application/use-cases/update-carousel.use-case.js";
import { DeleteCarouselUseCase } from "../application/use-cases/delete-carousel.use-case.js";
import { RequirePermission } from "../../../core/decorators/permissions.decorator.js";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCarouselDto } from "../application/dtos/create-carousel.dto.js";
import { Public } from "../../../core/decorators/public.decorator.js";
import { CommonStatus } from "../../../generated/prisma/enums.js";
import { UpdateCarouselDto } from "../application/dtos/update-carousel.dto.js";

const carouselUploadOptions = {
    storage: diskStorage({
        destination: (req, file, callback) => {
            const dest = join(process.cwd(), '..', 'uploads', 'carousels');
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            callback(null, dest);
        },
        filename: editFileName,
    }),
    fileFilter: imageFileFilter,
};

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('carousels')
export class CarouselsController {
    constructor(
        private readonly createUseCase: CreateCarouselUseCase,
        private readonly getUseCase: GetCarouselsUseCase,
        private readonly getByIdUseCase: GetCarouselByIdUseCase,
        private readonly updateUseCase: UpdateCarouselUseCase,
        private readonly deleteUseCase: DeleteCarouselUseCase,
    ) { }

    @Post()
    @RequirePermission('CAROUSELS', 'CREATE')
    @UseInterceptors(
        FileInterceptor('file', carouselUploadOptions),
        CleanupUploadedFileOnErrorInterceptor,
    )
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateCarouselDto,
    ) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        const imageUrl = `/uploads/carousels/${file.filename}`;
        return this.createUseCase.execute(imageUrl, dto);
    }

    @Public()
    @Get()
    findAll(
        @Query('status', new ParseEnumPipe(CommonStatus, { optional: true }))
        status?: CommonStatus,
    ) {
        return this.getUseCase.execute(status);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Put(':id')
    @RequirePermission('CAROUSELS', 'UPDATE')
    @UseInterceptors(
        FileInterceptor('file', carouselUploadOptions),
        CleanupUploadedFileOnErrorInterceptor,
    )
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCarouselDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const newImageUrl = file ? `/uploads/carousels/${file.filename}` : undefined;
        return this.updateUseCase.execute(id, dto, newImageUrl);
    }

    @Delete(':id')
    @RequirePermission('CAROUSELS', 'DELETE')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}