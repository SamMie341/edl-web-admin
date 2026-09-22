import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import * as fs from 'fs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateMagazineUseCase } from '../application/use-cases/create-magazine.use-case.js';
import { UpdateMagazineUseCase } from '../application/use-cases/update-magazine.use-case.js';
import { DeleteMagazinUseCase } from '../application/use-cases/delete-magazine.use-case.js';
import { GetMagazinesUseCase } from '../application/use-cases/get-magazines.use-case.js';
import { GetMagazineByIdUseCase } from '../application/use-cases/get-magazine-by-id.use-case.js';
import { IncrementMagazineDownloadUseCase } from '../application/use-cases/increment-magazine-download.use-case.js';
import { UploadMagazineFilesUseCase } from '../application/use-cases/upload-magazine-files.use-case.js';
import { CreateMagazineDto } from '../application/dtos/create-magazine.dto.js';
import { UpdateMagazineDto } from '../application/dtos/update-magazine.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { documentFileFilter, editFileName, imageFileFilter } from '../../../core/utils/file-upload.utils.js';

@UseGuards(JwtAuthGuard)
@Controller('magazines')
export class MagazinesController {
    constructor(
        private readonly createUseCase: CreateMagazineUseCase,
        private readonly updateUseCase: UpdateMagazineUseCase,
        private readonly deleteUseCase: DeleteMagazinUseCase,
        private readonly getUseCase: GetMagazinesUseCase,
        private readonly getByIdUseCase: GetMagazineByIdUseCase,
        private readonly incrementDownloadUseCase: IncrementMagazineDownloadUseCase,
        private readonly uploadFileUseCase: UploadMagazineFilesUseCase,
    ) { }

    @Post()
    create(@Body() dto: CreateMagazineDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMagazineDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }

    @Get()
    findAll() {
        return this.getUseCase.execute();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Put(':id/download')
    async incrementDownloadCount(@Param('id', ParseIntPipe) id: number) {
        const updated = await this.incrementDownloadUseCase.execute(id);
        return {
            downloadCount: updated.downloadCount
        }
    }

    @Post(':id/upload/cover')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination(req, file, callback) {
                const dest = join(process.cwd(), '..', 'uploads', 'magazines', 'covers');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                callback(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    async uploadCover(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        const path = `/uploads/magazines/covers/${file.filename}`;
        const data = await this.uploadFileUseCase.execute(id, 'coverImage', path);
        return {
            message: 'ອັບໂຫຼດຮູບໜ້າປົກສຳເລັດ',
            imagePath: path,
            data
        }
    }

    @Post(':id/upload/document')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination(req, file, callback) {
                const dest = join(process.cwd(), '..', 'uploads', 'magazines', 'documents');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                callback(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: documentFileFilter,
    }))
    async uploadDocument(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ PDF');
        const path = `/uploads/magazines/documents/${file.filename}`;
        const data = await this.uploadFileUseCase.execute(id, 'fileUrl', path);
        return {
            message: 'ອັບໂຫຼດໄຟລ໌ເອກະສານສຳເລັດ',
            documentPath: path,
            data,
        }
    }
}