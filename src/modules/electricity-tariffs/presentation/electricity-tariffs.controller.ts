import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, Query, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { editFileName, imageFileFilter, documentFileFilter } from '../../../core/utils/file-upload.utils.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateElectricityTariffDto } from '../application/dtos/create-electricity-tariff.dto.js';
import { UpdateElectricityTariffDto } from '../application/dtos/update-electricity-tariff.dto.js';
import { CreateElectricityTariffUseCase } from '../application/use-cases/create-electricity-tariff.use-case.js';
import { DeleteElectricityTariffUseCase } from '../application/use-cases/delete-electricity-tariff.use-case.js';
import { GetElectricityTariffByIdUseCase } from '../application/use-cases/get-electricity-tariff-by-id.usecase.js';
import { GetElectricityTariffsUseCase } from '../application/use-cases/get-electricity-tariff.use-case.js';
import { UpdateElectricityTariffUseCase } from '../application/use-cases/update-electricity-tariff.use-case.js';
import { UploadElectricityTariffFilesUseCase } from '../application/use-cases/upload-electricity-tariff-files.use-case.js';

@UseGuards(JwtAuthGuard)
@Controller('electricity-tariffs')
export class ElectricityTariffsController {
    constructor(
        private readonly createUseCase: CreateElectricityTariffUseCase,
        private readonly updateUseCase: UpdateElectricityTariffUseCase,
        private readonly deleteUseCase: DeleteElectricityTariffUseCase,
        private readonly getAllUseCase: GetElectricityTariffsUseCase,
        private readonly getByIdUseCase: GetElectricityTariffByIdUseCase,
        private readonly uploadFilesUseCase: UploadElectricityTariffFilesUseCase,
    ) { }

    @Post()
    create(@Body() createDto: CreateElectricityTariffDto) { return this.createUseCase.execute(createDto); }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.getAllUseCase.execute(search, pageNum, limitNum);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) { return this.getByIdUseCase.execute(id); }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateElectricityTariffDto) { return this.updateUseCase.execute(id, updateDto); }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { return this.deleteUseCase.execute(id); }

    // API ສຳລັບອັບໂຫຼດຮູບພາບ
    @Post(':id/upload/image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = join(process.cwd(), '..', 'uploads', 'electricity-tariffs', 'images');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    async uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        const path = `/uploads/electricity-tariffs/images/${file.filename}`;
        const data = await this.uploadFilesUseCase.execute(id, 'imageUrl', path);
        return { message: 'ອັບໂຫຼດຮູບພາບສຳເລັດ', imagePath: path, data };
    }

    // API ສຳລັບອັບໂຫຼດເອກະສານ PDF
    @Post(':id/upload/document')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = join(process.cwd(), '..', 'uploads', 'electricity-tariffs', 'documents');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: documentFileFilter,
    }))
    async uploadDocument(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ PDF');
        const path = `/uploads/electricity-tariffs/documents/${file.filename}`;
        const data = await this.uploadFilesUseCase.execute(id, 'pdfUrl', path);
        return { message: 'ອັບໂຫຼດໄຟລ໌ PDF ສຳເລັດ', documentPath: path, data };
    }
}