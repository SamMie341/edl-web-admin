import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateDepartmentUseCase } from './application/use-cases/create-department.use-case.js';
import { DeleteDepartmentUseCase } from './application/use-cases/delete-department.use-case.js';
import { GetDepartmentByIdUseCase } from './application/use-cases/get-department-by-id.use-case.js';
import { GetDepartmentsUseCase } from './application/use-cases/get-departments.use-case.js';
import { UpdateDepartmentUseCase } from './application/use-cases/update-department.use-case.js';
import { DEPARTMENT_REPOSITORY } from './domain/repositories/department.repository.interface.js';
import { PrismaDepartmentRepository } from './infrastructure/database/prisma-department.repository.js';
import { DepartmentsController } from './presentation/departments.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [DepartmentsController],
    providers: [
        CreateDepartmentUseCase,
        GetDepartmentsUseCase,
        GetDepartmentByIdUseCase,
        UpdateDepartmentUseCase,
        DeleteDepartmentUseCase,
        {
            provide: DEPARTMENT_REPOSITORY,
            useClass: PrismaDepartmentRepository,
        },
    ],
})
export class DepartmentsModule { }