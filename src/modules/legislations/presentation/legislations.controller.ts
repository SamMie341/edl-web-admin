import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, Query, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { editFileName, documentFileFilter } from '../../../core/utils/file-upload.utils.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateLegislationDto } from '../application/dto/create-legislation.dto.js';
import { UpdateLegislationDto } from '../application/dto/update-legislation.dto.js';
import { CreateLegislationUseCase } from '../application/use-cases/create-legislation.use-case.js';
import { DeleteLegislationUseCase } from '../application/use-cases/delete-legislation.use-case.js';
import { GetLegislationByIdUseCase } from '../application/use-cases/get-legislation-by-id.use-case.js';
import { GetLegislationsUseCase } from '../application/use-cases/get-legislation.use-case.js';
import { UpdateLegislationUseCase } from '../application/use-cases/update-legislation.use-case.js';
import { UploadLegislationFileUseCase } from '../application/use-cases/upload-legislation-file.use-case.js';

@UseGuards(JwtAuthGuard)
@Controller('legislations')
export class LegislationsController {
  constructor(
    private readonly createUseCase: CreateLegislationUseCase,
    private readonly updateUseCase: UpdateLegislationUseCase,
    private readonly deleteUseCase: DeleteLegislationUseCase,
    private readonly getAllUseCase: GetLegislationsUseCase,
    private readonly getByIdUseCase: GetLegislationByIdUseCase,
    private readonly uploadFileUseCase: UploadLegislationFileUseCase,
  ) { }

  @Post()
  create(@Body() createDto: CreateLegislationDto) { return this.createUseCase.execute(createDto); }

  @Get()
  findAll(@Query('search') search?: string,
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateLegislationDto) { return this.updateUseCase.execute(id, updateDto); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.deleteUseCase.execute(id); }

  // API ສຳລັບອັບໂຫຼດເອກະສານ PDF ນິຕິກຳ
  @Post(':id/upload/document')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // ເກັບໄຟລ໌ໄວ້ໃນໂຟນເດີ uploads/legislations
        const dest = join(process.cwd(), '..', 'uploads', 'legislations');
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
      },
      filename: editFileName,
    }),
    fileFilter: documentFileFilter, // ໃຊ້ filter ໂຕດຽວກັບ Magazine
  }))
  async uploadDocument(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ PDF');
    const path = `/uploads/legislations/${file.filename}`;
    const data = await this.uploadFileUseCase.execute(id, path);
    return { message: 'ອັບໂຫຼດເອກະສານນິຕິກຳສຳເລັດ', documentPath: path, data };
  }
}