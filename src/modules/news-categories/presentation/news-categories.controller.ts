import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { Public } from '../../../core/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../auth/presentation/guards/permissions.guard.js';
import { RequirePermission } from '../../../core/decorators/permissions.decorator.js';
import { CreateNewsCategoryDto } from '../application/dtos/create-news-category.dto.js';
import { UpdateNewsCategoryDto } from '../application/dtos/update-news-category.dto.js';
import { CreateNewsCategoryUseCase } from '../application/use-cases/create-news-category.use-case.js';
import { DeleteNewsCategoryUseCase } from '../application/use-cases/delete-news-category.use-case.js';
import { GetNewsCategoryByIdUseCase } from '../application/use-cases/get-news-category-by-id.use-case.js';
import { GetNewsCategoriesUseCase } from '../application/use-cases/get-news-category.use-case.js';
import { UpdateNewsCategoryUseCase } from '../application/use-cases/update-news-category.use-case.js';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('news-categories')
export class NewsCategoriesController {
    constructor(
        private readonly createUseCase: CreateNewsCategoryUseCase,
        private readonly updateUseCase: UpdateNewsCategoryUseCase,
        private readonly deleteUseCase: DeleteNewsCategoryUseCase,
        private readonly getAllUseCase: GetNewsCategoriesUseCase,
        private readonly getByIdUseCase: GetNewsCategoryByIdUseCase,
    ) { }

    @Post()
    @RequirePermission('NEWS_CATEGORIES', 'CREATE')
    create(@Body() createDto: CreateNewsCategoryDto) {
        return this.createUseCase.execute(createDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.getAllUseCase.execute();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Put(':id')
    @RequirePermission('NEWS_CATEGORIES', 'UPDATE')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateNewsCategoryDto) {
        return this.updateUseCase.execute(id, updateDto);
    }

    @Delete(':id')
    @RequirePermission('NEWS_CATEGORIES', 'DELETE')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}
