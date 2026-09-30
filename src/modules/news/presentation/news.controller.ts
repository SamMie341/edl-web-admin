import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException, Query, Put } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { editFileName, imageFileFilter } from '../../../core/utils/file-upload.utils.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateNewsDto } from '../application/dtos/create-news.dto.js';
import { UpdateNewsDto } from '../application/dtos/update-news.dto.js';
import { CreateNewsUseCase } from '../application/use-cases/create-news.use-case.js';
import { DeleteNewsUseCase } from '../application/use-cases/delete-news.use-case.js';
import { GetNewsByIdUseCase } from '../application/use-cases/get-news-by-id.use-case.js';
import { GetNewsUseCase } from '../application/use-cases/get-news.use-case.js';
import { IncrementNewsViewUseCase } from '../application/use-cases/increment-news-view.use-case.js';
import { UpdateNewsUseCase } from '../application/use-cases/update-news.use-case.js';
import { UploadNewsImagesUseCase } from '../application/use-cases/upload-news-images.use-case.js';

@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
    constructor(
        private readonly createUseCase: CreateNewsUseCase,
        private readonly updateUseCase: UpdateNewsUseCase,
        private readonly deleteUseCase: DeleteNewsUseCase,
        private readonly getAllUseCase: GetNewsUseCase,
        private readonly getByIdUseCase: GetNewsByIdUseCase,
        private readonly incrementViewUseCase: IncrementNewsViewUseCase,
        private readonly uploadImagesUseCase: UploadNewsImagesUseCase,
    ) { }

    @Post()
    create(@Body() createDto: CreateNewsDto) { return this.createUseCase.execute(createDto); }

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
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateNewsDto) { return this.updateUseCase.execute(id, updateDto); }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { return this.deleteUseCase.execute(id); }

    @Put(':id/view')
    async incrementViewCount(@Param('id', ParseIntPipe) id: number) {
        const updated = await this.incrementViewUseCase.execute(id);
        return { message: 'ເພີ່ມຍອດເຂົ້າຊົມສຳເລັດ', viewCount: updated.viewCount };
    }

    // API ອັບໂຫຼດຮູບປົກ (1 ຮູບ)
    @Post(':id/upload/cover')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = join(process.cwd(), '..', 'uploads', 'news', 'covers');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    async uploadCover(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        const path = `/uploads/news/covers/${file.filename}`;
        const data = await this.uploadImagesUseCase.uploadCover(id, path);
        return { message: 'ອັບໂຫຼດຮູບປົກສຳເລັດ', imagePath: path, data };
    }

    // API ອັບໂຫຼດຮູບ Gallery (ຫຼາຍຮູບ)
    @Post(':id/upload/gallery')
    @UseInterceptors(FilesInterceptor('files', 10, { // ອະນຸຍາດສູງສຸດ 10 ຮູບຕໍ່ຄັ້ງ
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = join(process.cwd(), '..', 'uploads', 'news', 'galleries');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    async uploadGallery(@Param('id', ParseIntPipe) id: number, @UploadedFiles() files: Array<Express.Multer.File>) {
        if (!files || files.length === 0) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');

        const paths = files.map(file => `/uploads/news/galleries/${file.filename}`);
        const data = await this.uploadImagesUseCase.uploadGallery(id, paths);

        return { message: 'ອັບໂຫຼດຮູບ Gallery ສຳເລັດ', imagePaths: paths, data };
    }
}