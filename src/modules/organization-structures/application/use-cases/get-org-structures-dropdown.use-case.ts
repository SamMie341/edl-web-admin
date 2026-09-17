import { Inject, Injectable } from "@nestjs/common";
import * as orgStructureRepositoryInterface from "../../domain/repositories/org-structure.repository.interface.js";
import { StructureType } from "../../../../generated/prisma/enums.js";

@Injectable()
export class GetOrgStructureDropdownUseCase {
    constructor(@Inject(orgStructureRepositoryInterface.ORG_STRUCTURE_REPOSITORY) private readonly repo: orgStructureRepositoryInterface.IOrgStructureRepository) { }

    async execute() {
        const list = await this.repo.findForDropdown();
        const types = Object.values(StructureType);

        return {
            items: list,
            structureTypes: types,
        }
    }
}