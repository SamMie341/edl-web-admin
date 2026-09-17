import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { CreateOrgStructureUseCase } from "../application/use-cases/create-org-structure.use-case.js";
import { UpdateOrgStructureUseCase } from "../application/use-cases/update-org-structure.use-case.js";
import { DeleteOrgStructureUseCase } from "../application/use-cases/delete-org-strcuture.use-case.js";
import { GetOrgStructureUseCase } from "../application/use-cases/get-org-structure.use-case.js";
import { CreateOrgStructureDto } from "../application/dtos/create-org-structure.dto.js";
import { UpdateOrgStructureDto } from "../application/dtos/update-org-structure.dto.js";
import { GetOrgStructureDropdownUseCase } from "../application/use-cases/get-org-structures-dropdown.use-case.js";
import { UploadImageStructureUseCase } from "../application/use-cases/upload-org-structure-image.use-case.js";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";
import * as fs from 'fs';
import { editFileName, imageFileFilter } from "../../../core/utils/file-upload.utils.js";

@UseGuards(JwtAuthGuard)
@Controller('org-structures')
export class OrganizationStructureController {
    constructor(
        private readonly createUseCase: CreateOrgStructureUseCase,
        private readonly updateUseCase: UpdateOrgStructureUseCase,
        private readonly deleteUseCase: DeleteOrgStructureUseCase,
        private readonly getUseCase: GetOrgStructureUseCase,
        private readonly getDroddownUseCase: GetOrgStructureDropdownUseCase,
        private readonly uploadImageUseCase: UploadImageStructureUseCase,
    ) { }

    @Post()
    create(@Body() dto: CreateOrgStructureDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrgStructureDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete('id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }

    @Get()
    findAll() {
        return this.getUseCase.execute();
    }

    @Get('dropdown')
    dropdown() {
        return this.getDroddownUseCase.execute();
    }

    @Post(':id/upload/image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination(req, file, callback) {
                    const dest = join(process.cwd(), '..', 'uploads', 'org-structures');
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest, { recursive: true });
                    }
                    callback(null, dest);
                },
                filename: editFileName,
            }),
            fileFilter: imageFileFilter
        })
    )
    async uploadImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException("ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ")
        }
        const imagePath = `/uploads/org-structures/${file.filename}`;

        const updatedRecord = await this.uploadImageUseCase.execute(id, imagePath);

        return {
            message: 'ອັບໂຫຼດຮູບພາບໂຄງສ້າງສຳເລັດ',
            imagePath: imagePath,
            data: updatedRecord,
        }
    }
}