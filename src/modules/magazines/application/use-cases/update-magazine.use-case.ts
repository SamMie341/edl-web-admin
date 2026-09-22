import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as magazineRepositoryInterface from "../../domain/repositories/magazine.repository.interface.js";
import { UpdateMagazineDto } from "../dtos/update-magazine.dto.js";

@Injectable()
export class UpdateMagazineUseCase {
    constructor(
        @Inject(magazineRepositoryInterface.MAGAZINE_REPOSITORY) private readonly repo: magazineRepositoryInterface.IMagazineRepository
    ) { }

    async execute(id: number, dto: UpdateMagazineDto) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນ');
        return this.repo.update(id, dto);
    }
}