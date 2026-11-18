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
import { CreateApplianceCategoryDto } from '../application/dtos/create-appliance-category.dto.js';
import { UpdateApplianceCategoryDto } from '../application/dtos/update-appliance-category.dto.js';
import { CreateApplianceCategoryUseCase } from '../application/use-cases/create-appliance-category.use-case.js';
import { DeleteApplianceCategoryUseCase } from '../application/use-cases/delete-appliance-category.use-case.js';
import { GetApplianceCategoriesUseCase } from '../application/use-cases/get-appliance-categories.use-case.js';
import { GetApplianceCategoryByIdUseCase } from '../application/use-cases/get-appliance-category-by-id.use-case.js';
import { UpdateApplianceCategoryUseCase } from '../application/use-cases/update-appliance-category.use-case.js';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('electricity-calculator/categories')
export class ApplianceCategoriesController {
    constructor(
        private readonly getListUseCase: GetApplianceCategoriesUseCase,
        private readonly getByIdUseCase: GetApplianceCategoryByIdUseCase,
        private readonly createUseCase: CreateApplianceCategoryUseCase,
        private readonly updateUseCase: UpdateApplianceCategoryUseCase,
        private readonly deleteUseCase: DeleteApplianceCategoryUseCase,
    ) { }

    @Get()
    @RequirePermission('ELECTRICITY_CALCULATOR', 'READ')
    findAll(@Query('search') search?: string) {
        return this.getListUseCase.execute(search);
    }

    @Get(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'READ')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Post()
    @RequirePermission('ELECTRICITY_CALCULATOR', 'CREATE')
    create(@Body() dto: CreateApplianceCategoryDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'UPDATE')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateApplianceCategoryDto,
    ) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'DELETE')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}
