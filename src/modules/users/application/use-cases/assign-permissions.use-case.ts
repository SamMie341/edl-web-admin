import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import { AssignPermissionsDto } from "../dto/assign-permissions.dto.js";

@Injectable()
export class AssignPermissionsUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute(userId: number, dto: AssignPermissionsDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ນີ້ໃນລະບົບ');
        }

        return await this.prisma.$transaction(async (tx) => {
            // 1. ລຶບສິດເກົ່າຂອງຜູ້ໃຊ້ນີ້ອອກກ່ອນ
            await tx.userPermission.deleteMany({
                where: { userId },
            });

            // 2. ມອບສິດຊຸດໃໝ່
            if (dto.permissionIds && dto.permissionIds.length > 0) {
                const validPermissions = await tx.permission.findMany({
                    where: { id: { in: dto.permissionIds } },
                    select: { id: true },
                });

                if (validPermissions.length > 0) {
                    await tx.userPermission.createMany({
                        data: validPermissions.map((p) => ({
                            userId,
                            permissionId: p.id,
                        })),
                    });
                }
            }

            // 3. ດຶງຂໍ້ມູນຜູ້ໃຊ້ພ້ອມລາຍການສິດທີ່ອັບເດດແລ້ວ
            const updatedUser = await tx.user.findUnique({
                where: { id: userId },
                include: {
                    userPermissions: {
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
            });

            return {
                message: 'ກຳນົດສິດການນຳໃຊ້ສຳເລັດແລ້ວ',
                user: updatedUser,
            };
        });
    }
}
