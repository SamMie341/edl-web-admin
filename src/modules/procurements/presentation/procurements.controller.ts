import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, Query, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { editFileName, imageFileFilter, documentFileFilter } from '../../../core/utils/file-upload.utils.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateProcurementDto } from '../application/dtos/create-procurement.dto.js';
import { UpdateProcurementDto } from '../application/dtos/update-procurement.dto.js';
import { CreateProcurementUseCase } from '../application/use-cases/create-procurement.use-case.js';
import { DeleteProcurementUseCase } from '../application/use-cases/delete-procurement.use-case.js';
import { GetProcurementByIdUseCase } from '../application/use-cases/get-procurement-by-id.use-case.js';
import { GetProcurementsUseCase } from '../application/use-cases/get-procurement.use-case.js';
import { UpdateProcurementUseCase } from '../application/use-cases/update-procurement.use-case.js';
import { UploadProcurementFilesUseCase } from '../application/use-cases/upload-procurement-files.use-case.js';

@UseGuards(JwtAuthGuard)
@Controller('procurements')
export class ProcurementsController {
    constructor(
        private readonly createUseCase: CreateProcurementUseCase,
        private readonly updateUseCase: UpdateProcurementUseCase,
        private readonly deleteUseCase: DeleteProcurementUseCase,
        private readonly getAllUseCase: GetProcurementsUseCase,
        private readonly getByIdUseCase: GetProcurementByIdUseCase,
        private readonly uploadFilesUseCase: UploadProcurementFilesUseCase,
    ) { }

    @Post()
    create(@Body() createDto: CreateProcurementDto) { return this.createUseCase.execute(createDto); }

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
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateProcurementDto) { return this.updateUseCase.execute(id, updateDto); }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { return this.deleteUseCase.execute(id); }

    // API ສຳລັບອັບໂຫຼດຮູບພາບປະກອບການປະກວດລາຄາ
    @Post(':id/upload/image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = join(process.cwd(), '..', 'uploads', 'procurements', 'images');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    async uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        const path = `/uploads/procurements/images/${file.filename}`;
        const data = await this.uploadFilesUseCase.execute(id, 'imageUrl', path);
        return { message: 'ອັບໂຫຼດຮູບພາບສຳເລັດ', imagePath: path, data };
    }

    // API ສຳລັບອັບໂຫຼດເອກະສານ PDF ລາຍລະອຽດການປະມູນ (TOR)
    @Post(':id/upload/document')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = join(process.cwd(), '..', 'uploads', 'procurements', 'documents');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: documentFileFilter,
    }))
    async uploadDocument(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ PDF');
        const path = `/uploads/procurements/documents/${file.filename}`;
        const data = await this.uploadFilesUseCase.execute(id, 'fileUrl', path);
        return { message: 'ອັບໂຫຼດໄຟລ໌ເອກະສານສຳເລັດ', documentPath: path, data };
    }
}