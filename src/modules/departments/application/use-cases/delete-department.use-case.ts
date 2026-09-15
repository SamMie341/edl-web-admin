import { Injectable, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import * as departmentRepositoryInterface from '../../domain/repositories/department.repository.interface.js';
import { GetDepartmentByIdUseCase } from './get-department-by-id.use-case.js';

@Injectable()
export class DeleteDepartmentUseCase {
    constructor(
        @Inject(departmentRepositoryInterface.DEPARTMENT_REPOSITORY) private readonly repository: departmentRepositoryInterface.IDepartmentRepository,
        private readonly getDepartmentByIdUseCase: GetDepartmentByIdUseCase,
    ) { }

    async execute(id: number) {
        await this.getDepartmentByIdUseCase.execute(id); // ກວດສອບວ່າມີຢູ່ຈິງ

        try {
            await this.repository.delete(id);
            return { message: 'ລຶບຂໍ້ມູນຝ່າຍສຳເລັດ' };
        } catch (error) {
            // ດັກຈັບ Error ກໍລະນີມີສາຂາ ຫຼື ຜູ້ໃຊ້ຜູກມັດຢູ່ (Foreign Key Constraint)
            throw new BadRequestException('ບໍ່ສາມາດລຶບໄດ້ ເພາະມີສາຂາ ຫຼື ຜູ້ໃຊ້ງານສັງກັດຝ່າຍນີ້ຢູ່');
        }
    }
}