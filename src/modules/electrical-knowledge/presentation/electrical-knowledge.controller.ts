import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { editFileName, imageFileFilter } from '../../../core/utils/file-upload.utils.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateElectricalKnowledgeDto } from '../application/dtos/create-electrical-knowledge.dto.js';
import { UpdateElectricalKnowledgeDto } from '../application/dtos/update-electrical-knowledge.dto.js';
import { CreateElectricalKnowledgeUseCase } from '../application/use-cases/create-electrical-knowledge.use-case.js';
import { DeleteElectricalKnowledgeUseCase } from '../application/use-cases/delete-electrical-knowledge.use-case.js';
import { GetElectricalKnowledgeByIdUseCase } from '../application/use-cases/get-electrical-knowledge-by-id.use-case.js';
import { UpdateElectricalKnowledgeUseCase } from '../application/use-cases/update-electrical-knowledge.use-case.js';
import { GetElectricalKnowledgeUseCase } from '../application/use-cases/get-electrical-knowledge.use-case.js';
import { UploadElectricalKnowledgeUseCase } from '../application/use-cases/upload-electrical-knowledge-image.use-case.js';

@UseGuards(JwtAuthGuard)
@Controller('electrical-knowledge')
export class ElectricalKnowledgeController {
    constructor(
        private readonly createUseCase: CreateElectricalKnowledgeUseCase,
        private readonly updateUseCase: UpdateElectricalKnowledgeUseCase,
        private readonly deleteUseCase: DeleteElectricalKnowledgeUseCase,
        private readonly getAllUseCase: GetElectricalKnowledgeUseCase,
        private readonly getByIdUseCase: GetElectricalKnowledgeByIdUseCase,
        private readonly uploadImageUseCase: UploadElectricalKnowledgeUseCase,
    ) { }

    @Post()
    create(@Body() createDto: CreateElectricalKnowledgeDto) {
        return this.createUseCase.execute(createDto);
    }

    @Get()
    findAll() {
        return this.getAllUseCase.execute();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateElectricalKnowledgeDto) {
        return this.updateUseCase.execute(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }

    // API ອັບໂຫຼດຮູບປົກ
    @Post(':id/upload/cover')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const dest = join(process.cwd(), '..', 'uploads', 'electrical-knowledge');
                    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                    cb(null, dest);
                },
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadCover(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        const imagePath = `/uploads/electrical-knowledge/${file.filename}`;
        const updatedRecord = await this.uploadImageUseCase.execute(id, imagePath);
        return { message: 'ອັບໂຫຼດຮູບປົກສຳເລັດ', imagePath, data: updatedRecord };
    }
}