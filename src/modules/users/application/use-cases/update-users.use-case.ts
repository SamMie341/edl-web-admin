import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as userRepositoryInterface from "../../domain/repositories/user.repository.interface.js";
import { UpdateUserDto } from "../dto/update-user.dto.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import { findMissingActorPermissions } from "../../../../core/utils/permission-resolver.util.js";
import type { RequestUser } from "../../../auth/domain/entities/auth-user.entity.js";

const ROLE_WITH_PERMISSIONS_SELECT = {
    id: true,
    name: true,
    rolePermissions: {
        select: {
            permission: {
                select: {
                    module: true,
                    action: true,
                },
            },
        },
    },
} as const;

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject(userRepositoryInterface.USER_REPOSITORY)
        private readonly userRepo: userRepositoryInterface.IUserRepository,
        private readonly prismaService: PrismaService,
    ) { }

    async execute(id: number, dto: UpdateUserDto, currentUser?: RequestUser) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!user) {
            throw new NotFoundException('ບໍ່ມີຜູ້ໃຊ້ນີ້ໃນລະບົບ');
        }

        let targetRole: {
            id: number;
            name: string;
            rolePermissions: { permission: { module: string; action: string } }[];
        } | null = null;

        if (dto.roleId !== undefined) {
            targetRole = await this.prismaService.role.findUnique({
                where: { id: dto.roleId },
                select: ROLE_WITH_PERMISSIONS_SELECT,
            });
            if (!targetRole) {
                throw new BadRequestException(`ບໍ່ພົບບົດບາດ (Role) ລະຫັດ ID: ${dto.roleId}`);
            }
            if (dto.role && targetRole.name !== dto.role.trim()) {
                throw new BadRequestException('roleId ແລະ role ທີ່ລະບຸບໍ່ກົງກັນ');
            }
        } else if (dto.role !== undefined) {
            const roleName = dto.role.trim();
            targetRole = await this.prismaService.role.findUnique({
                where: { name: roleName },
                select: ROLE_WITH_PERMISSIONS_SELECT,
            });
            if (!targetRole) {
                throw new BadRequestException(`ບໍ່ພົບບົດບາດ (Role) "${roleName}" ໃນລະບົບ`);
            }
        }

        if (currentUser) {
            if (currentUser.id === user.id) {
                throw new ForbiddenException('ບໍ່ສາມາດແກ້ໄຂບົດບາດ ຫຼື ສະຖານະຂອງຕົນເອງໄດ້');
            }

            const isActorSuperAdmin = currentUser.role === 'SUPERADMIN';
            const targetIsSuperAdmin = user.role?.name === 'SUPERADMIN';

            if (targetIsSuperAdmin && !isActorSuperAdmin) {
                throw new ForbiddenException('ບໍ່ສາມາດແກ້ໄຂບົດບາດ ຫຼື ສະຖານະຂອງ Superadmin ໄດ້');
            }

            if (targetRole && !isActorSuperAdmin) {
                if (targetRole.name === 'SUPERADMIN') {
                    throw new ForbiddenException('ສະເພາະ Superadmin ເທົ່ານັ້ນທີ່ສາມາດມອບສິດ Superadmin ໄດ້');
                }

                const targetPerms = targetRole.rolePermissions.map((rp) => rp.permission);
                const missingPerms = findMissingActorPermissions(currentUser, targetPerms);
                if (missingPerms.length > 0) {
                    throw new ForbiddenException('ທ່ານບໍ່ສາມາດກຳນົດບົດບາດທີ່ມີສິດທິສູງກວ່າສິດທິຂອງຕົນເອງໄດ້');
                }
            }
        }

        const dataToUpdate: any = {};
        if (targetRole !== null) dataToUpdate.roleId = targetRole.id;
        if (dto.status !== undefined) dataToUpdate.status = dto.status;

        return this.userRepo.update(id, dataToUpdate);
    }
}
