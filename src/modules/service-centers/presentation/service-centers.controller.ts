import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { SyncServiceCenterUseCase } from "../application/use-cases/sync-service-center.use-case.js";
import { GetServiceUseCase } from "../application/use-cases/get-service-center.use-case.js";
import { GetServiceByIdUseCase } from "../application/use-cases/get-service-center-by-id.use-case.js";
import { CreateServiceCenterUseCase } from "../application/use-cases/create-service-center.use-case.js";
import { UpdateServiceCenterUseCase } from "../application/use-cases/update-service-center.use-case.js";
import { DeleteServiceCenterUseCase } from "../application/use-cases/delete-service-center.use-case.js";
import { CreateServiceCenterDto } from "../application/dtos/create-service-center.dto.js";
import { UpdateServiceCenterDto } from "../application/dtos/update-service-center.dto.js";
import { UploadServiceCenterImageUseCase } from "../application/use-cases/upload-service-center-image.use-case.js";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";
import * as fs from 'fs';
import { editFileName, imageFileFilter } from "../../../core/utils/file-upload.utils.js";

@UseGuards(JwtAuthGuard)
@Controller('service-centers')
export class ServiceCenterController {
    constructor(
        private readonly syncUseCase: SyncServiceCenterUseCase,
        private readonly getUseCase: GetServiceUseCase,
        private readonly createUseCase: CreateServiceCenterUseCase,
        private readonly updateUseCase: UpdateServiceCenterUseCase,
        private readonly deleteUseCase: DeleteServiceCenterUseCase,
        private readonly getByIdUseCase: GetServiceByIdUseCase,
        private readonly uploadImageUseCase: UploadServiceCenterImageUseCase,
    ) { }

    @Post(':id/upload/image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination(req, file, callback) {
                    const dest = join(process.cwd(), '..', 'uploads', 'centers');
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest, { recursive: true });
                    }
                    callback(null, dest);
                },
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        }

        const imagePath = `/uploads/centers/${file.filename}`;

        const updatedCenter = await this.uploadImageUseCase.execute(id, imagePath);

        return {
            message: 'ອັບໂຫຼດຮູບພາບສູນບໍລິການສຳເລັດ',
            imagePath: imagePath,
            serviceCenter: updatedCenter,
        }
    }

    @Post()
    async create(@Body() dto: CreateServiceCenterDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceCenterDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }

    @Post('sync')
    async syncData() {
        const result = await this.syncUseCase.execute();
        return {
            message: 'Sync ຂໍ້ມູນສູນບໍລິການສຳເລັດ',
            total: result.totalSynced,
            data: result.data,
        };
    }

    @Get()
    async findAll() {
        return await this.getUseCase.execute();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.getByIdUseCase.execute(id);
    }
}