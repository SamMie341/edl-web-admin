import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as magazineRepositoryInterface from "../../domain/repositories/magazine.repository.interface.js";

@Injectable()
export class GetMagazineByIdUseCase {
    constructor(
        @Inject(magazineRepositoryInterface.MAGAZINE_REPOSITORY)
        private readonly repo: magazineRepositoryInterface.IMagazineRepository,
    ) { }

    async execute(id: number) {
        const magazine = await this.repo.findById(id);
        if (!magazine) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນວາລະສານ');
        return magazine;
    }
}