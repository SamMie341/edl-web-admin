import { Inject, Injectable } from "@nestjs/common";
import * as villageRepositoryInterface from "../../domain/repositories/village.repository.interface.js";

@Injectable()
export class GetVillagesUseCase {
    constructor(@Inject(villageRepositoryInterface.VILLAGE_REPOSITORY) private readonly villageRepository: villageRepositoryInterface.IVillageRepository,) { }

    async execute() {
        return this.villageRepository.findAll();
    }
}