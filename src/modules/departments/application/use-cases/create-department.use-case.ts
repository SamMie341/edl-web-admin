import { Injectable, Inject } from '@nestjs/common';
import * as departmentRepositoryInterface from '../../domain/repositories/department.repository.interface.js';
import { CreateDepartmentDto } from '../dtos/create-department.dto.js';

@Injectable()
export class CreateDepartmentUseCase {
    constructor(@Inject(departmentRepositoryInterface.DEPARTMENT_REPOSITORY) private readonly repository: departmentRepositoryInterface.IDepartmentRepository) { }

    async execute(dto: CreateDepartmentDto) {
        return this.repository.create(dto);
    }
}