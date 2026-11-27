import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import {
    findMissingActorPermissions,
    resolveEffectivePermissions,
} from "../../../../core/utils/permission-resolver.util.js";
import { PermissionEffect } from "../../../../generated/prisma/enums.js";
import type { RequestUser } from "../../../auth/domain/entities/auth-user.entity.js";
import { USER_SAFE_SELECT } from "../../infrastructure/database/prisma-user.repository.js";
import { AssignPermissionsDto } from "../dto/assign-permissions.dto.js";

@Injectable()
export class AssignPermissionsUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(userId: number, dto: AssignPermissionsDto, currentUser?: RequestUser) {
        const allowIds = [...new Set(dto.permissionIds ?? [])];
        const denyIds = [...new Set(dto.deniedPermissionIds ?? [])];
        const denyIdSet = new Set(denyIds);
        const conflictingIds = allowIds.filter((id) => denyIdSet.has(id));

        if (conflictingIds.length > 0) {
            throw new BadRequestException(
                `ບໍ່ສາມາດກຳນົດສິດດຽວກັນໃຫ້ທັງອະນຸຍາດ ແລະ ປະຕິເສດໃນເວລາດຽວກັນ (ID: ${conflictingIds.join(', ')})`,
            );
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: {
                    select: {
                        name: true,
                        rolePermissions: {
                            select: {
                                permission: {
                                    select: {
                                        id: true,
                                        module: true,
                                        action: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ນີ້ໃນລະບົບ');
        }

        if (currentUser) {
            if (currentUser.id === user.id) {
                throw new ForbiddenException('ບໍ່ສາມາດແກ້ໄຂສິດທິຂອງຕົນເອງໄດ້');
            }

            const isActorSuperAdmin = currentUser.role === 'SUPERADMIN';
            const targetIsSuperAdmin = user.role?.name === 'SUPERADMIN';

            if (targetIsSuperAdmin && !isActorSuperAdmin) {
                throw new ForbiddenException('ບໍ່ສາມາດແກ້ໄຂສິດທິຂອງ Superadmin ໄດ້');
            }
        }

        return await this.prisma.$transaction(async (tx) => {
            // 1. ກວດສອບຄວາມຖືກຕ້ອງຂອງ Permission IDs ແລະ ຂອບເຂດສິດຂອງຜູ້ດຳເນີນການກ່ອນແກ້ໄຂ DB
            const allRequestedIds = [...allowIds, ...denyIds];
            if (allRequestedIds.length > 0) {
                const validPermissions = await tx.permission.findMany({
                    where: { id: { in: allRequestedIds } },
                    select: { id: true, module: true, action: true },
                });
                const validById = new Map(validPermissions.map((p) => [p.id, p]));
                const invalidIds = allRequestedIds.filter((id) => !validById.has(id));

                if (invalidIds.length > 0) {
                    throw new BadRequestException(`ບໍ່ພົບສິດທິ (Permission) ID: ${invalidIds.join(', ')}`);
                }

                if (currentUser && currentUser.role !== 'SUPERADMIN' && allowIds.length > 0) {
                    const requestedAllowPerms = allowIds.map((id) => validById.get(id)!);
                    const missingPerms = findMissingActorPermissions(currentUser, requestedAllowPerms);
                    if (missingPerms.length > 0) {
                        throw new ForbiddenException('ທ່ານບໍ່ສາມາດມອບສິດທິທີ່ຕົນເອງບໍ່ມີໄດ້');
                    }
                }
            }

            // 2. ລຶບສິດເກົ່າຂອງຜູ້ໃຊ້ນີ້ອອກກ່ອນ
            await tx.userPermission.deleteMany({
                where: { userId },
            });

            // 3. ມອບສິດ ALLOW ແລະ ປິດສິດ DENY ຊຸດໃໝ່
            if (allRequestedIds.length > 0) {
                const rowsToCreate = [
                    ...allowIds.map((permissionId) => ({
                        userId,
                        permissionId,
                        effect: PermissionEffect.ALLOW,
                    })),
                    ...denyIds.map((permissionId) => ({
                        userId,
                        permissionId,
                        effect: PermissionEffect.DENY,
                    })),
                ];

                if (rowsToCreate.length > 0) {
                    await tx.userPermission.createMany({
                        data: rowsToCreate,
                    });
                }
            }

            // 3. ດຶງຂໍ້ມູນຜູ້ໃຊ້ພ້ອມລາຍການສິດທີ່ອັບເດດແລ້ວ (ບໍ່ສົ່ງ passwordHash)
            const updatedUser = await tx.user.findUnique({
                where: { id: userId },
                select: {
                    ...USER_SAFE_SELECT,
                    userPermissions: {
                        select: {
                            effect: true,
                            permission: {
                                select: {
                                    id: true,
                                    module: true,
                                    action: true,
                                },
                            },
                        },
                    },
                },
            });

            const rolePermissions = user.role?.rolePermissions.map((rp) => rp.permission) ?? [];
            const resolved = resolveEffectivePermissions(
                rolePermissions,
                updatedUser?.userPermissions ?? [],
            );

            return {
                message: 'ກຳນົດສິດການນຳໃຊ້ສຳເລັດແລ້ວ',
                user: updatedUser,
                allowedPermissions: resolved.allowedPermissions,
                deniedPermissions: resolved.deniedPermissions,
                effectivePermissions: resolved.effectivePermissions,
            };
        });
    }
}
