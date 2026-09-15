import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as userRepositoryInterface from "../../domain/repositories/user.repository.interface.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject(userRepositoryInterface.USER_REPOSITORY)
        private readonly userRepo: userRepositoryInterface.IUserRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('ບໍ່ມີຜູ້ໃຊ້ນີ້ໃນລະບົບ');
        }
        await this.userRepo.delete(id);
        return {
            message: 'ລຶບຜູ້ໃຊ້ສຳເລັດ'
        }
    }
}