import { Inject, Injectable } from "@nestjs/common";
import * as roleRepoInterface from "../../domain/repositories/role.repository.interface.js";
import type { IRoleRepository } from "../../domain/repositories/role.repository.interface.js";

@Injectable()
export class GetRolesUseCase {
    constructor(
        @Inject(roleRepoInterface.ROLE_REPOSITORY) private readonly repo: IRoleRepository,
    ) { }

    async execute(search?: string, page: number = 1, limit: number = 10) {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
        return await this.repo.findAll(search, validPage, validLimit);
    }
}
