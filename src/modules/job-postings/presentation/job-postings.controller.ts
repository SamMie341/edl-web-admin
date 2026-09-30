import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, Put, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateJobPostingDto } from '../application/dtos/create-job-posting.dto.js';
import { UpdateJobPostingDto } from '../application/dtos/update-job-posting.dto.js';
import { CreateJobPostingUseCase } from '../application/use-cases/create-job-posting.use-case.js';
import { DeleteJobPostingUseCase } from '../application/use-cases/delete-job-posting.use-case.js';
import { GetJobPostingByIdUseCase } from '../application/use-cases/get-job-posting-by-id.use-case.js';
import { GetJobPostingsUseCase } from '../application/use-cases/get-job-posting.use-case.js';
import { UpdateJobPostingUseCase } from '../application/use-cases/update-job-posting.use-case.js';
import { UploadJobPostingImageUseCase } from '../application/use-cases/upload-job-posting-image.use-case.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { editFileName, imageFileFilter } from '../../../core/utils/file-upload.utils.js';
import * as fs from 'fs';

@UseGuards(JwtAuthGuard)
@Controller('job-postings')
export class JobPostingsController {
    constructor(
        private readonly createUseCase: CreateJobPostingUseCase,
        private readonly updateUseCase: UpdateJobPostingUseCase,
        private readonly deleteUseCase: DeleteJobPostingUseCase,
        private readonly getAllUseCase: GetJobPostingsUseCase,
        private readonly getByIdUseCase: GetJobPostingByIdUseCase,
        private readonly uploadImageUseCase: UploadJobPostingImageUseCase,
    ) { }

    @Post()
    create(@Body() createDto: CreateJobPostingDto) { return this.createUseCase.execute(createDto); }

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
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateJobPostingDto) { return this.updateUseCase.execute(id, updateDto); }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { return this.deleteUseCase.execute(id); }

    @Post(':id/upload/image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = join(process.cwd(), '..', 'uploads', 'job-postings');
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    async uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        const path = `/uploads/job-postings/${file.filename}`;
        const data = await this.uploadImageUseCase.execute(id, path);
        return { message: 'ອັບໂຫຼດຮູບພາບປະກາດຮັບສະໝັກສຳເລັດ', imagePath: path, data };
    }
}