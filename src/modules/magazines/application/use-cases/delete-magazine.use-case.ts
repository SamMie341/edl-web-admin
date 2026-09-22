import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as magazineRepositoryInterface from "../../domain/repositories/magazine.repository.interface.js";

@Injectable()
export class DeleteMagazinUseCase {
    constructor(
        @Inject(magazineRepositoryInterface.MAGAZINE_REPOSITORY)
        private readonly repo: magazineRepositoryInterface.IMagazineRepository,
    ) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນວາລະສານ`);
        return this.repo.delete(id);
    }
}