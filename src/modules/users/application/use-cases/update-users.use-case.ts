import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as userRepositoryInterface from "../../domain/repositories/user.repository.interface.js";
import { UpdateUserDto } from "../dto/update-user.dto.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject(userRepositoryInterface.USER_REPOSITORY)
        private readonly userRepo: userRepositoryInterface.IUserRepository,
        private readonly prismaService: PrismaService,
    ) { }

    async execute(id: number, dto: UpdateUserDto) {
        const user = await this.prismaService.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('ບໍ່ມີຜູ້ໃຊ້ນີ້ໃນລະບົບ');
        }
        return this.userRepo.update(id, dto);
    }
}