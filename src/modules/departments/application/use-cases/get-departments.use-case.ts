import { Injectable, Inject } from '@nestjs/common';
import * as departmentRepositoryInterface from '../../domain/repositories/department.repository.interface.js';

@Injectable()
export class GetDepartmentsUseCase {
    constructor(@Inject(departmentRepositoryInterface.DEPARTMENT_REPOSITORY) private readonly repository: departmentRepositoryInterface.IDepartmentRepository) { }

    async execute() {
        return this.repository.findAll();
    }
}