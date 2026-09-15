import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as departmentRepositoryInterface from '../../domain/repositories/department.repository.interface.js';

@Injectable()
export class GetDepartmentByIdUseCase {
    constructor(@Inject(departmentRepositoryInterface.DEPARTMENT_REPOSITORY) private readonly repository: departmentRepositoryInterface.IDepartmentRepository) { }

    async execute(id: number) {
        const department = await this.repository.findById(id);
        if (!department) {
            throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນຝ່າຍລະຫັດ ID: ${id}`);
        }
        return department;
    }
}