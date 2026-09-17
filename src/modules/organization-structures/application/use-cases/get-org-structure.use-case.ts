import { Inject, Injectable } from "@nestjs/common";
import * as orgStructureRepositoryInterface from "../../domain/repositories/org-structure.repository.interface.js";

@Injectable()
export class GetOrgStructureUseCase {
    constructor(@Inject(orgStructureRepositoryInterface.ORG_STRUCTURE_REPOSITORY) private readonly repo: orgStructureRepositoryInterface.IOrgStructureRepository) { }

    async execute() {
        return await this.repo.findAll();
    }
}