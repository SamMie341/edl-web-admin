import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { RequirePermission } from '../../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../auth/presentation/guards/permissions.guard.js';
import { CreateTariffCategoryDto } from '../application/dtos/create-tariff-category.dto.js';
import { UpdateTariffCategoryDto } from '../application/dtos/update-tariff-category.dto.js';
import { CreateTariffCategoryUseCase } from '../application/use-cases/create-tariff-category.use-case.js';
import { DeleteTariffCategoryUseCase } from '../application/use-cases/delete-tariff-category.use-case.js';
import { GetTariffCategoriesUseCase } from '../application/use-cases/get-tariff-categories.use-case.js';
import { GetTariffCategoryByIdUseCase } from '../application/use-cases/get-tariff-category-by-id.use-case.js';
import { UpdateTariffCategoryUseCase } from '../application/use-cases/update-tariff-category.use-case.js';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('electricity-calculator/tariff-categories')
export class TariffCategoriesController {
    constructor(
        private readonly getListUseCase: GetTariffCategoriesUseCase,
        private readonly getByIdUseCase: GetTariffCategoryByIdUseCase,
        private readonly createUseCase: CreateTariffCategoryUseCase,
        private readonly updateUseCase: UpdateTariffCategoryUseCase,
        private readonly deleteUseCase: DeleteTariffCategoryUseCase,
    ) { }

    @Get()
    @RequirePermission('ELECTRICITY_CALCULATOR', 'READ')
    findAll() {
        return this.getListUseCase.execute();
    }

    @Get(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'READ')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Post()
    @RequirePermission('ELECTRICITY_CALCULATOR', 'CREATE')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateTariffCategoryDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'UPDATE')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTariffCategoryDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'DELETE')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}
