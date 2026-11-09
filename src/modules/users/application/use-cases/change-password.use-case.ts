import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import * as userRepositoryInterface from "../../domain/repositories/user.repository.interface.js";
import { ChangePasswordDto } from "../dto/change-password.dto.js";
import type { RequestUser } from "../../../auth/domain/entities/auth-user.entity.js";

@Injectable()
export class ChangePasswordUseCase {
    constructor(
        @Inject(userRepositoryInterface.USER_REPOSITORY)
        private readonly repo: userRepositoryInterface.IUserRepository,
    ) { }

    async execute(id: number, dto: ChangePasswordDto, currentUser?: RequestUser) {
        let user = await this.repo.findById(id);
        if (!user) {
            user = await this.repo.findByEmployeeCode(id.toString());
        }

        if (!user) {
            throw new NotFoundException(`ບໍ່ພົບຜູ້ໃຊ້ ID: ${id} ໃນລະບົບ`);
        }

        // ກວດສອບສິດການປ່ຽນລະຫັດຜ່ານ
        if (currentUser) {
            const isSelf = currentUser.id === user.id;

            if (isSelf) {
                // 1. ປ່ຽນລະຫັດຜ່ານຂອງຕົນເອງ: ຕ້ອງໃສ່ລະຫັດຜ່ານເກົ່າສະເໝີ
                if (!dto.oldPassword) {
                    throw new BadRequestException('ກະລຸນາປ້ອນລະຫັດຜ່ານເກົ່າ (oldPassword)');
                }
            } else {
                // 2. ປ່ຽນລະຫັດຜ່ານໃຫ້ຜູ້ໃຊ້ອື່ນ (Admin Reset): ຕ້ອງມີສິດ USERS:UPDATE ຫຼື ເປັນ SUPERADMIN
                const isSuperAdmin = currentUser.role === 'SUPERADMIN';
                const canUpdate = currentUser.permissions?.some(
                    (p) => p.module === 'USERS' && p.action === 'UPDATE',
                );

                if (!isSuperAdmin && !canUpdate) {
                    throw new ForbiddenException('ທ່ານບໍ່ມີສິດປ່ຽນລະຫັດຜ່ານຂອງຜູ້ໃຊ້ອື່ນ');
                }

                // ຫ້າມ Admin ທຳມະດາ Reset ລະຫັດຜ່ານຂອງ Superadmin
                const targetIsSuperAdmin = user.role?.name === 'SUPERADMIN';
                if (targetIsSuperAdmin && !isSuperAdmin) {
                    throw new ForbiddenException('ບໍ່ສາມາດປ່ຽນລະຫັດຜ່ານຂອງ Superadmin ໄດ້');
                }
            }
        }

        const newPassword = dto.newPassword || dto.password;
        if (!newPassword) {
            throw new BadRequestException('ກະລຸນາປ້ອນລະຫັດຜ່ານໃໝ່');
        }

        if (newPassword.length < 6) {
            throw new BadRequestException('ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ');
        }

        if (dto.confirmPassword && dto.confirmPassword !== newPassword) {
            throw new BadRequestException('ລະຫັດຜ່ານໃໝ່ ແລະ ການຢືນຢັນລະຫັດຜ່ານບໍ່ກົງກັນ');
        }

        if (dto.oldPassword) {
            const isOldPasswordValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
            if (!isOldPasswordValid) {
                throw new BadRequestException('ລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ');
            }
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        await this.repo.update(user.id, { passwordHash });

        return {
            message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດ',
            userId: user.id,
            employeeCode: user.employeeCode,
        };
    }
}