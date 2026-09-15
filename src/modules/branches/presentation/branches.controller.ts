import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { SyncBranchesUseCase } from '../application/use-cases/sync-branches.use-case.js';
import { GetBranchesUseCase } from '../application/use-cases/get-branches.use-case.js';
import { CreateBranchUseCase } from '../application/use-cases/create-branch.use-case.js';
import { UpdateBranchUseCase } from '../application/use-cases/update-branch.use-case.js';
import { DeleteBranchUseCase } from '../application/use-cases/delete-branch.use-case.js';
import { GetBranchByIdUseCase } from '../application/use-cases/get-branch-by-id.use-case.js';
import { CreateBranchDto } from '../application/dtos/create-branch.dto.js';
import { UpdateBranchDto } from '../application/dtos/update-branch.dto.js';
import { UploadBranchImageUseCase } from '../application/use-cases/upload-branch-image.use-case.js';

import { editFileName, imageFileFilter } from '../../../core/utils/file-upload.utils.js';

@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchesController {
    constructor(
        private readonly syncBranchesUseCase: SyncBranchesUseCase,
        private readonly getBranchesUseCase: GetBranchesUseCase,
        private readonly createUseCase: CreateBranchUseCase,
        private readonly updateUseCase: UpdateBranchUseCase,
        private readonly deleteUseCase: DeleteBranchUseCase,
        private readonly getByIdUseCase: GetBranchByIdUseCase,

        private readonly uploadBranchImageUseCase: UploadBranchImageUseCase,
    ) { }

    @Post(':id/upload/:imageType')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination(req, file, callback) {
                    const dest = join(process.cwd(), '..', 'uploads', 'branches');
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest, { recursive: true });
                    }
                    callback(null, dest);
                },
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        })
    )
    async uploadImage(
        @Param('id', ParseIntPipe) id: number,
        @Param('imageType') imageType: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ');
        }
        const validImageTypes = ['branchImage', 'coverImage', 'orgChartImage'];
        if (!validImageTypes.includes(imageType)) {
            throw new BadRequestException('ປະເພດຮູບພາບບໍ່ຖືກຕ້ອງ (ຕ້ອງເປັນ ຮູບສາຂາ, ຮູບໜ້າປົກ, ຫຼື ຮູບໂຄ່ງຮ່າງ)')
        }

        const imagePath = `/uploads/branches/${file.filename}`;

        const updatedBranch = await this.uploadBranchImageUseCase.execute(id, imageType as any, imagePath);

        return {
            message: 'ອັບໂຫຼດຮູບພາບສຳເລັດ',
            imagePath: imagePath,
            branch: updatedBranch,
        }
    }

    // POST /api/v1/branches/sync
    @Post('sync')
    async syncData() {
        const result = await this.syncBranchesUseCase.execute();
        return {
            message: 'ຊິງຄ໌ຂໍ້ມູນສາຂາສຳເລັດແລ້ວ',
            total: result.totalSynced,
            data: result.data,
        };
    }

    // GET /api/v1/branches
    @Get()
    findAll() {
        return this.getBranchesUseCase.execute();
    }

    @Post('sync')
    create(@Body() createBranchDto: CreateBranchDto) {
        return this.createUseCase.execute(createBranchDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, dto: UpdateBranchDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}