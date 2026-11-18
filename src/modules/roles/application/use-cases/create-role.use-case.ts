import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { findMissingActorPermissions } from "../../../../core/utils/permission-resolver.util.js";
import type { RequestUser } from "../../../auth/domain/entities/auth-user.entity.js";
import { CreateRoleDto } from "../dtos/create-role.dto.js";
import * as roleRepoInterface from "../../domain/repositories/role.repository.interface.js";
import type { IRoleRepository } from "../../domain/repositories/role.repository.interface.js";

@Injectable()
export class CreateRoleUseCase {
    constructor(
        @Inject(roleRepoInterface.ROLE_REPOSITORY) private readonly repo: IRoleRepository,
    ) { }

    async execute(dto: CreateRoleDto, currentUser?: RequestUser) {
        const trimmedName = dto.name.trim();
        if (trimmedName === 'SUPERADMIN' && currentUser && currentUser.role !== 'SUPERADMIN') {
            throw new ForbiddenException('ບໍ່ສາມາດສ້າງບົດບາດ SUPERADMIN ໄດ້');
        }

        const existing = await this.repo.findByName(trimmedName);
        if (existing) {
            throw new ConflictException(`ຊື່ສິດທິ (Role) "${trimmedName}" ນີ້ມີຢູ່ໃນລະບົບແລ້ວ`);
        }

        let uniquePermissionIds: number[] | undefined;
        if (dto.permissionIds !== undefined) {
            uniquePermissionIds = [...new Set(dto.permissionIds)];
            if (uniquePermissionIds.length > 0) {
                const foundPermissions = await this.repo.findPermissionsByIds(uniquePermissionIds);
                const foundIdSet = new Set(foundPermissions.map((p) => p.id));
                const invalidIds = uniquePermissionIds.filter((id) => !foundIdSet.has(id));

                if (invalidIds.length > 0) {
                    throw new BadRequestException(`ບໍ່ພົບສິດທິ (Permission) ID: ${invalidIds.join(', ')}`);
                }

                if (currentUser && currentUser.role !== 'SUPERADMIN') {
                    const missingPerms = findMissingActorPermissions(currentUser, foundPermissions);
                    if (missingPerms.length > 0) {
                        throw new ForbiddenException('ທ່ານບໍ່ສາມາດສ້າງບົດບາດທີ່ມີສິດທິສູງກວ່າສິດທິຂອງຕົນເອງໄດ້');
                    }
                }
            }
        }

        return await this.repo.create(
            {
                name: trimmedName,
                description: dto.description?.trim(),
            },
            uniquePermissionIds,
        );
    }
}
