import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { findMissingActorPermissions } from "../../../../core/utils/permission-resolver.util.js";
import type { RequestUser } from "../../../auth/domain/entities/auth-user.entity.js";
import { UpdateRoleDto } from "../dtos/update-role.dto.js";
import * as roleRepoInterface from "../../domain/repositories/role.repository.interface.js";
import type { IRoleRepository } from "../../domain/repositories/role.repository.interface.js";

function areIdSetsEqual(a: number[], b: number[]): boolean {
    const setA = new Set(a);
    const setB = new Set(b);
    if (setA.size !== setB.size) return false;
    for (const id of setA) {
        if (!setB.has(id)) return false;
    }
    return true;
}

@Injectable()
export class UpdateRoleUseCase {
    constructor(
        @Inject(roleRepoInterface.ROLE_REPOSITORY) private readonly repo: IRoleRepository,
    ) { }

    async execute(id: number, dto: UpdateRoleDto, currentUser?: RequestUser) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນສິດທິ (Role) ລະຫັດ ID ${id}`);
        }

        if (currentUser && currentUser.role !== 'SUPERADMIN') {
            if (existing.name === 'SUPERADMIN') {
                throw new ForbiddenException('ບໍ່ສາມາດແກ້ໄຂບົດບາດ SUPERADMIN ໄດ້');
            }

            const existingPerms = existing.permissions ?? [];
            const missingExisting = findMissingActorPermissions(currentUser, existingPerms);
            if (missingExisting.length > 0) {
                throw new ForbiddenException('ທ່ານບໍ່ມີສິດແກ້ໄຂບົດບາດທີ່ມີສິດທິສູງກວ່າສິດທິຂອງຕົນເອງໄດ້');
            }
        }

        let nextPermissionIds = dto.permissionIds;
        if (existing.name === 'SUPERADMIN') {
            if (dto.name && dto.name.trim() !== 'SUPERADMIN') {
                throw new BadRequestException('ບໍ່ສາມາດປ່ຽນຊື່ສິດທິ SUPERADMIN ໄດ້');
            }

            if (dto.permissionIds !== undefined) {
                const existingPermissionIds = (existing.permissions ?? []).map((p: { id: number }) => p.id);
                if (!areIdSetsEqual(dto.permissionIds, existingPermissionIds)) {
                    throw new BadRequestException('ບໍ່ສາມາດແກ້ໄຂລາຍການສິດທິຂອງ SUPERADMIN ໄດ້');
                }
                nextPermissionIds = undefined;
            }
        } else if (dto.permissionIds !== undefined) {
            const uniquePermissionIds = [...new Set(dto.permissionIds)];
            if (uniquePermissionIds.length > 0) {
                const foundPermissions = await this.repo.findPermissionsByIds(uniquePermissionIds);
                const foundIdSet = new Set(foundPermissions.map((p) => p.id));
                const invalidIds = uniquePermissionIds.filter((permId) => !foundIdSet.has(permId));

                if (invalidIds.length > 0) {
                    throw new BadRequestException(`ບໍ່ພົບສິດທິ (Permission) ID: ${invalidIds.join(', ')}`);
                }

                if (currentUser && currentUser.role !== 'SUPERADMIN') {
                    const missingPerms = findMissingActorPermissions(currentUser, foundPermissions);
                    if (missingPerms.length > 0) {
                        throw new ForbiddenException('ທ່ານບໍ່ສາມາດກຳນົດສິດທິທີ່ສູງກວ່າສິດທິຂອງຕົນເອງໃຫ້ບົດບາດໄດ້');
                    }
                }
            }
            nextPermissionIds = uniquePermissionIds;
        }

        const dataToUpdate: { name?: string; description?: string } = {};

        if (dto.name) {
            const trimmedName = dto.name.trim();
            if (trimmedName !== existing.name) {
                const nameTaken = await this.repo.findByName(trimmedName);
                if (nameTaken && nameTaken.id !== id) {
                    throw new ConflictException(`ຊື່ສິດທິ (Role) "${trimmedName}" ນີ້ມີຢູ່ໃນລະບົບແລ້ວ`);
                }
            }
            dataToUpdate.name = trimmedName;
        }

        if (dto.description !== undefined) {
            dataToUpdate.description = dto.description?.trim();
        }

        return await this.repo.update(id, dataToUpdate, nextPermissionIds);
    }
}
