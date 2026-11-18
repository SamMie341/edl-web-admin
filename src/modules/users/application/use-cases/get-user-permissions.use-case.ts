import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import { resolveEffectivePermissions } from "../../../../core/utils/permission-resolver.util.js";

@Injectable()
export class GetUserPermissionsUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
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

        if (!user) {
            throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ນີ້ໃນລະບົບ');
        }

        const rolePermissions = user.role?.rolePermissions.map((rp) => rp.permission) ?? [];
        const resolved = resolveEffectivePermissions(rolePermissions, user.userPermissions);

        return {
            userId: user.id,
            role: user.role
                ? {
                    id: user.role.id,
                    name: user.role.name,
                    description: user.role.description,
                }
                : null,
            rolePermissions,
            allowedPermissions: resolved.allowedPermissions,
            deniedPermissions: resolved.deniedPermissions,
            effectivePermissions: resolved.effectivePermissions,
        };
    }
}
