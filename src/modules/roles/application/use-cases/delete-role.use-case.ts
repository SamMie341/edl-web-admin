import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as roleRepoInterface from "../../domain/repositories/role.repository.interface.js";
import type { IRoleRepository } from "../../domain/repositories/role.repository.interface.js";

@Injectable()
export class DeleteRoleUseCase {
    constructor(
        @Inject(roleRepoInterface.ROLE_REPOSITORY) private readonly repo: IRoleRepository,
    ) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນສິດທິ (Role) ລະຫັດ ID ${id}`);
        }

        if (existing.name === 'SUPERADMIN') {
            throw new BadRequestException('ບໍ່ສາມາດລຶບສິດທິ SUPERADMIN ຂອງລະບົບໄດ້');
        }

        const userCount = await this.repo.countUsersByRoleId(id);
        if (userCount > 0) {
            throw new BadRequestException(
                `ບໍ່ສາມາດລຶບສິດທິ "${existing.name}" ໄດ້ ເນື່ອງຈາກຍັງມີຜູ້ໃຊ້ງານຈຳນວນ ${userCount} ຄົນສັງກັດຢູ່. ກະລຸນາຍ້າຍ Role ຂອງຜູ້ໃຊ້ກ່ອນລຶບ!`,
            );
        }

        await this.repo.delete(id);

        return {
            message: `ລຶບສິດທິ "${existing.name}" ສຳເລັດແລ້ວ`,
        };
    }
}
