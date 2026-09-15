import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import * as departmentRepositoryInterface from '../../domain/repositories/department.repository.interface.js';
import { UpdateDepartmentDto } from '../dtos/update-department.dto.js';
import { GetDepartmentByIdUseCase } from './get-department-by-id.use-case.js';

@Injectable()
export class UpdateDepartmentUseCase {
    constructor(
        @Inject(departmentRepositoryInterface.DEPARTMENT_REPOSITORY) private readonly repository: departmentRepositoryInterface.IDepartmentRepository,
        private readonly getDepartmentByIdUseCase: GetDepartmentByIdUseCase,
    ) { }

    async execute(id: number, dto: UpdateDepartmentDto) {
        await this.getDepartmentByIdUseCase.execute(id); // ກວດສອບກ່ອນວ່າມີຂໍ້ມູນແທ້
        return this.repository.update(id, dto);
    }
}