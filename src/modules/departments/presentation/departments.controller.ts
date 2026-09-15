import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CreateDepartmentDto } from '../application/dtos/create-department.dto.js';
import { UpdateDepartmentDto } from '../application/dtos/update-department.dto.js';
import { CreateDepartmentUseCase } from '../application/use-cases/create-department.use-case.js';
import { DeleteDepartmentUseCase } from '../application/use-cases/delete-department.use-case.js';
import { GetDepartmentByIdUseCase } from '../application/use-cases/get-department-by-id.use-case.js';
import { GetDepartmentsUseCase } from '../application/use-cases/get-departments.use-case.js';
import { UpdateDepartmentUseCase } from '../application/use-cases/update-department.use-case.js';

@UseGuards(JwtAuthGuard) // ຕ້ອງ Login ກ່ອນ
@Controller('departments')
export class DepartmentsController {
    constructor(
        private readonly createUseCase: CreateDepartmentUseCase,
        private readonly getDepartmentsUseCase: GetDepartmentsUseCase,
        private readonly getByIdUseCase: GetDepartmentByIdUseCase,
        private readonly updateUseCase: UpdateDepartmentUseCase,
        private readonly deleteUseCase: DeleteDepartmentUseCase,
    ) { }

    @Post()
    create(@Body() createDepartmentDto: CreateDepartmentDto) {
        return this.createUseCase.execute(createDepartmentDto);
    }

    @Get()
    findAll() {
        return this.getDepartmentsUseCase.execute();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDepartmentDto: UpdateDepartmentDto) {
        return this.updateUseCase.execute(id, updateDepartmentDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}