import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Public } from "../../../core/decorators/public.decorator.js";
import { JwtAuthGuard } from "../../auth/presentation/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../../auth/presentation/guards/permissions.guard.js";
import { RequirePermission } from "../../../core/decorators/permissions.decorator.js";
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

@UseGuards(JwtAuthGuard, PermissionsGuard)
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
    @RequirePermission('SERVICE_CENTERS', 'UPDATE')
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
    @RequirePermission('SERVICE_CENTERS', 'CREATE')
    async create(@Body() dto: CreateServiceCenterDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    @RequirePermission('SERVICE_CENTERS', 'UPDATE')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceCenterDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @RequirePermission('SERVICE_CENTERS', 'DELETE')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }

    @Post('sync')
    @RequirePermission('SERVICE_CENTERS', 'CREATE')
    async syncData() {
        const result = await this.syncUseCase.execute();
        return {
            message: 'Sync ຂໍ້ມູນສູນບໍລິການສຳເລັດ',
            total: result.totalSynced,
            totalFailed: result.totalFailed,
            failed: result.failed,
            data: result.data,
        };
    }

    @Public()
    @Get()
    async findAll(
        @Query('provinceId') provinceId?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return await this.getUseCase.execute(parsedProvinceId, pageNum, limitNum);
    }

    @Public()
    @Get('province/:provinceId')
    async findByProvince(
        @Param('provinceId', ParseIntPipe) provinceId: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return await this.getUseCase.execute(provinceId, pageNum, limitNum);
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.getByIdUseCase.execute(id);
    }
}
