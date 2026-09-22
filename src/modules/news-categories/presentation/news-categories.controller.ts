import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateNewsCategoryDto } from '../application/dtos/create-news-category.dto.js';
import { UpdateNewsCategoryDto } from '../application/dtos/update-news-category.dto.js';
import { CreateNewsCategoryUseCase } from '../application/use-cases/create-news-category.use-case.js';
import { DeleteNewsCategoryUseCase } from '../application/use-cases/delete-news-category.use-case.js';
import { GetNewsCategoryByIdUseCase } from '../application/use-cases/get-news-category-by-id.use-case.js';
import { GetNewsCategoriesUseCase } from '../application/use-cases/get-news-category.use-case.js';
import { UpdateNewsCategoryUseCase } from '../application/use-cases/update-news-category.use-case.js';

@UseGuards(JwtAuthGuard)
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
    create(@Body() createDto: CreateNewsCategoryDto) {
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
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateNewsCategoryDto) {
        return this.updateUseCase.execute(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}