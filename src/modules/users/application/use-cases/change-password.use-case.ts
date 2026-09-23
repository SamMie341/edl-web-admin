import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import * as userRepositoryInterface from "../../domain/repositories/user.repository.interface.js";
import { ChangePasswordDto } from "../dto/change-password.dto.js";

@Injectable()
export class ChangePasswordUseCase {
    constructor(
        @Inject(userRepositoryInterface.USER_REPOSITORY)
        private readonly repo: userRepositoryInterface.IUserRepository,
    ) { }

    async execute(id: number, dto: ChangePasswordDto) {
        let user = await this.repo.findById(id);
        if (!user) {
            user = await this.repo.findByEmployeeCode(id.toString());
        }

        if (!user) {
            throw new NotFoundException(`ບໍ່ພົບຜູ້ໃຊ້ ID: ${id} ໃນລະບົບ`);
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