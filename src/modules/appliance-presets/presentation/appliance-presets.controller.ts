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
import { CreateAppliancePresetDto } from '../application/dtos/create-appliance-preset.dto.js';
import { UpdateAppliancePresetDto } from '../application/dtos/update-appliance-preset.dto.js';
import { CreateAppliancePresetUseCase } from '../application/use-cases/create-appliance-preset.use-case.js';
import { DeleteAppliancePresetUseCase } from '../application/use-cases/delete-appliance-preset.use-case.js';
import { GetAppliancePresetsUseCase } from '../application/use-cases/get-appliance-presets.use-case.js';
import { GetAppliancePresetByIdUseCase } from '../application/use-cases/get-appliance-preset-by-id.use-case.js';
import { UpdateAppliancePresetUseCase } from '../application/use-cases/update-appliance-preset.use-case.js';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('electricity-calculator/presets')
export class AppliancePresetsController {
    constructor(
        private readonly getListUseCase: GetAppliancePresetsUseCase,
        private readonly getByIdUseCase: GetAppliancePresetByIdUseCase,
        private readonly createUseCase: CreateAppliancePresetUseCase,
        private readonly updateUseCase: UpdateAppliancePresetUseCase,
        private readonly deleteUseCase: DeleteAppliancePresetUseCase,
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
    create(@Body() dto: CreateAppliancePresetDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'UPDATE')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAppliancePresetDto,
    ) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'DELETE')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}
