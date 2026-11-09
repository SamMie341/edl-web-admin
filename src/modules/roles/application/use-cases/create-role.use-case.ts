import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "../dtos/create-role.dto.js";
import * as roleRepoInterface from "../../domain/repositories/role.repository.interface.js";
import type { IRoleRepository } from "../../domain/repositories/role.repository.interface.js";

@Injectable()
export class CreateRoleUseCase {
    constructor(
        @Inject(roleRepoInterface.ROLE_REPOSITORY) private readonly repo: IRoleRepository,
    ) { }

    async execute(dto: CreateRoleDto) {
        const trimmedName = dto.name.trim();
        const existing = await this.repo.findByName(trimmedName);
        if (existing) {
            throw new ConflictException(`ຊື່ສິດທິ (Role) "${trimmedName}" ນີ້ມີຢູ່ໃນລະບົບແລ້ວ`);
        }

        return await this.repo.create(
            {
                name: trimmedName,
                description: dto.description?.trim(),
            },
            dto.permissionIds,
        );
    }
}
