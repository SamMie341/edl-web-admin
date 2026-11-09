import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Public } from "../../../core/decorators/public.decorator.js";
import { JwtAuthGuard } from "../../auth/presentation/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../../auth/presentation/guards/permissions.guard.js";
import { RequirePermission } from "../../../core/decorators/permissions.decorator.js";
import { CreateVisionMissionUseCase } from "../application/use-cases/create-vision-mission.use-case.js";
import { UpdateVisionMissionUseCase } from "../application/use-cases/update-vision-mission.use-case.js";
import { DeleteVisionMissionUseCase } from "../application/use-cases/delete-vision-mission.use-case.js";
import { GetVisionMissionUseCase } from "../application/use-cases/get-vision-mission.use-case.js";
import { UploadVisionMissionImageUseCase } from "../application/use-cases/upload-vision-mission-image.use-case.js";
import { CreateVisionMissionDto } from "../application/dtos/create-vision-mission.dto.js";
import { UpdateVisionMissionDto } from "../application/dtos/update-vision-missions.dto.js";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";
import * as fs from 'fs';
import { editFileName, imageFileFilter } from "../../../core/utils/file-upload.utils.js";
import { GetVisionMissionByIdUseCase } from "../application/use-cases/get-vision-mission-by-id.use-case.js";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vision-missions')
export class VisionMissionController {
    constructor(
        private readonly createUseCase: CreateVisionMissionUseCase,
        private readonly updateUseCase: UpdateVisionMissionUseCase,
        private readonly deleteUseCase: DeleteVisionMissionUseCase,
        private readonly getUseCase: GetVisionMissionUseCase,
        private readonly uploadImageUseCase: UploadVisionMissionImageUseCase,
        private readonly getById: GetVisionMissionByIdUseCase,
    ) { }

    @Post()
    @RequirePermission('VISION_MISSIONS', 'CREATE')
    create(@Body() dto: CreateVisionMissionDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    @RequirePermission('VISION_MISSIONS', 'UPDATE')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVisionMissionDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @RequirePermission('VISION_MISSIONS', 'DELETE')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }

    @Public()
    @Get()
    findAll() {
        return this.getUseCase.execute();
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.getById.execute(id);
    }

    @Post(':id/upload/image')
    @RequirePermission('VISION_MISSIONS', 'UPDATE')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination(req, file, callback) {
                const dest = join(process.cwd(), '..', 'uploads', 'vision-missions');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                callback(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    async uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        const imagePath = `/uploads/vision-missions/${file.filename}`;
        const updatedRecord = await this.uploadImageUseCase.execute(id, imagePath);
        return {
            message: 'ອັບໂຫຼດສຳເລັດ',
            imagePath,
            data: updatedRecord,
        }
    }
}
