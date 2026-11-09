import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateRoleDto } from "../dtos/update-role.dto.js";
import * as roleRepoInterface from "../../domain/repositories/role.repository.interface.js";
import type { IRoleRepository } from "../../domain/repositories/role.repository.interface.js";

@Injectable()
export class UpdateRoleUseCase {
    constructor(
        @Inject(roleRepoInterface.ROLE_REPOSITORY) private readonly repo: IRoleRepository,
    ) { }

    async execute(id: number, dto: UpdateRoleDto) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນສິດທິ (Role) ລະຫັດ ID ${id}`);
        }

        if (existing.name === 'SUPERADMIN' && dto.name && dto.name.trim() !== 'SUPERADMIN') {
            throw new BadRequestException('ບໍ່ສາມາດປ່ຽນຊື່ສິດທິ SUPERADMIN ໄດ້');
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

        return await this.repo.update(id, dataToUpdate, dto.permissionIds);
    }
}
