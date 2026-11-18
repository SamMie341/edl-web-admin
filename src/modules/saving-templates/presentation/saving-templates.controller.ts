import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { RequirePermission } from '../../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../auth/presentation/guards/permissions.guard.js';
import { CreateSavingTemplateDto } from '../application/dtos/create-saving-template.dto.js';
import { UpdateSavingTemplateDto } from '../application/dtos/update-saving-template.dto.js';
import { CreateSavingTemplateUseCase } from '../application/use-cases/create-saving-template.use-case.js';
import { DeleteSavingTemplateUseCase } from '../application/use-cases/delete-saving-template.use-case.js';
import { GetSavingTemplatesUseCase } from '../application/use-cases/get-saving-templates.use-case.js';
import { GetSavingTemplateByIdUseCase } from '../application/use-cases/get-saving-template-by-id.use-case.js';
import { UpdateSavingTemplateUseCase } from '../application/use-cases/update-saving-template.use-case.js';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('electricity-calculator/saving-templates')
export class SavingTemplatesController {
    constructor(
        private readonly getListUseCase: GetSavingTemplatesUseCase,
        private readonly getByIdUseCase: GetSavingTemplateByIdUseCase,
        private readonly createUseCase: CreateSavingTemplateUseCase,
        private readonly updateUseCase: UpdateSavingTemplateUseCase,
        private readonly deleteUseCase: DeleteSavingTemplateUseCase,
    ) { }

    @Get()
    @RequirePermission('ELECTRICITY_CALCULATOR', 'READ')
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('search') search?: string,
    ) {
        const catId = categoryId ? parseInt(categoryId, 10) : undefined;
        return this.getListUseCase.execute(catId, search);
    }

    @Get(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'READ')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Post()
    @RequirePermission('ELECTRICITY_CALCULATOR', 'CREATE')
    create(@Body() dto: CreateSavingTemplateDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'UPDATE')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSavingTemplateDto,
    ) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'DELETE')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}
