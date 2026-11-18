import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as userRepositoryInterface from "../../domain/repositories/user.repository.interface.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import type { RequestUser } from "../../../auth/domain/entities/auth-user.entity.js";

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject(userRepositoryInterface.USER_REPOSITORY)
        private readonly userRepo: userRepositoryInterface.IUserRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(id: number, currentUser?: RequestUser) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: {
                    select: { id: true, name: true },
                },
            },
        });
        if (!user) {
            throw new NotFoundException('ບໍ່ມີຜູ້ໃຊ້ນີ້ໃນລະບົບ');
        }

        if (currentUser) {
            if (currentUser.id === user.id) {
                throw new ForbiddenException('ບໍ່ສາມາດລຶບບັນຊີຂອງຕົນເອງໄດ້');
            }

            if (user.role?.name === 'SUPERADMIN' && currentUser.role !== 'SUPERADMIN') {
                throw new ForbiddenException('ບໍ່ສາມາດລຶບບັນຊີ Superadmin ໄດ້');
            }
        }

        if (user.role?.name === 'SUPERADMIN') {
            const superAdminCount = await this.prisma.user.count({
                where: {
                    role: { name: 'SUPERADMIN' },
                },
            });
            if (superAdminCount <= 1) {
                throw new BadRequestException('ບໍ່ສາມາດລຶບບັນຊີ Superadmin ຄົນສຸດທ້າຍຂອງລະບົບໄດ້');
            }
        }

        await this.userRepo.delete(id);
        return {
            message: 'ລຶບຜູ້ໃຊ້ສຳເລັດ'
        }
    }
}