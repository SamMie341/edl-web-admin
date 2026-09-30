import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreatePositionDto } from '../application/dtos/create-position.dto.js';
import { UpdatePositionDto } from '../application/dtos/update-position.dto.js';
import { CreatePositionUseCase } from '../application/use-cases/create-position.use-case.js';
import { DeletePositionUseCase } from '../application/use-cases/delete-position.use-case.js';
import { GetPositionByIdUseCase } from '../application/use-cases/get-position-by-id.use-case.js';
import { GetPositionsUseCase } from '../application/use-cases/get-position.use-case.js';
import { UpdatePositionUseCase } from '../application/use-cases/update-position.use-case.js';

@UseGuards(JwtAuthGuard)
@Controller('positions')
export class PositionsController {
    constructor(
        private readonly createUseCase: CreatePositionUseCase,
        private readonly updateUseCase: UpdatePositionUseCase,
        private readonly deleteUseCase: DeletePositionUseCase,
        private readonly getAllUseCase: GetPositionsUseCase,
        private readonly getByIdUseCase: GetPositionByIdUseCase,
    ) { }

    @Post()
    create(@Body() createDto: CreatePositionDto) { return this.createUseCase.execute(createDto); }

    @Get()
    findAll(
        @Query('search') search?: string,
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
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePositionDto) { return this.updateUseCase.execute(id, updateDto); }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { return this.deleteUseCase.execute(id); }
}