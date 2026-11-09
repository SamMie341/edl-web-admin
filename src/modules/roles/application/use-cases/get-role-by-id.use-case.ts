import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as roleRepoInterface from "../../domain/repositories/role.repository.interface.js";
import type { IRoleRepository } from "../../domain/repositories/role.repository.interface.js";

@Injectable()
export class GetRoleByIdUseCase {
    constructor(
        @Inject(roleRepoInterface.ROLE_REPOSITORY) private readonly repo: IRoleRepository,
    ) { }

    async execute(id: number) {
        const role = await this.repo.findById(id);
        if (!role) {
            throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນສິດທິ (Role) ລະຫັດ ID ${id}`);
        }
        return role;
    }
}
