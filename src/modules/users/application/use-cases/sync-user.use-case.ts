import { Injectable, Inject, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../../auth/auth.service.js';
import * as hrmServiceInterface from '../../domain/repositories/hrm.service.interface.js';
import * as userRepositoryInterface from '../../domain/repositories/user.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { Role, UserStatus } from '../../../../generated/prisma/enums.js';

@Injectable()
export class SyncUserUseCase {
    constructor(
        @Inject(hrmServiceInterface.HRM_SERVICE)
        private readonly hrmService: hrmServiceInterface.IHrmService,
        private readonly authService: AuthService,
        @Inject(userRepositoryInterface.USER_REPOSITORY)
        private readonly userRepository: userRepositoryInterface.IUserRepository,
        private readonly prismaService: PrismaService,
    ) { }

    async execute(employeeCode: string) {
        try {
            // 1. ດຶງຂໍ້ມູນຈາກ HRM (ຜ່ານ Interface)
            const emp = await this.hrmService.getEmployeeData(employeeCode);

            const hrmOffice = emp.office || emp.placeOffice;

            const firstName = emp.first_name_la || '';
            const lastName = emp.last_name_la || '';
            const email = emp.email ? emp.email : `${emp.emp_code}@edl.com.la`;
            const phoneNumber = emp.phone || null;
            const departmentName = hrmOffice?.department?.department_name || null;
            const divisionName = hrmOffice?.division?.division_name || null;
            const unitName = hrmOffice?.unit?.unit_name || null;

            const status = emp.status === 'A' ? UserStatus.ACTIVE : UserStatus.INACTIVE;

            const alReadyUser = await this.prismaService.user.findUnique({ where: { employeeCode } });
            if (alReadyUser) {
                return { message: `ລະຫັດ ${employeeCode} ມີໃນລະບົບແລ້ວ` };
            }

            // 2. ກວດສອບ ແລະ ບັນທຶກລົງຖານຂໍ້ມູນ (ຜ່ານ Repository Interface)
            let user = await this.userRepository.findByEmployeeCode(emp.emp_code.toString());

            if (user) {
                user = await this.userRepository.update(user.id, {
                    firstName, lastName, email, phoneNumber, departmentName, divisionName, unitName, status,
                });
            } else {
                const defaultPassword = `EDL${emp.emp_code}`;
                const passwordHash = await this.authService.hashPassword(defaultPassword);

                user = await this.userRepository.create({
                    employeeCode: emp.emp_code.toString(),
                    firstName, lastName, email, phoneNumber, departmentName, divisionName, unitName, status: UserStatus.ACTIVE,
                    passwordHash: passwordHash,
                    role: Role.ADMIN,
                });
            }

            return user;
        } catch (error: any) {
            if (error.status === 404 || error.status === 401) throw error;
            throw new BadRequestException(`ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຈາກ HRM: ${error.message}`);
        }
    }
}