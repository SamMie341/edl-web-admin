import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as newsTagRepositoryInterface from "../../domain/repositories/news-tag.repository.interface.js";

@Injectable()
export class DeleteNewsTagUseCase {
    constructor(
        @Inject(newsTagRepositoryInterface.NEWS_TAG_REPOSITORY) private readonly repo: newsTagRepositoryInterface.INewsTagRepository
    ) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນ`);
        return this.repo.delete(id);
    }
}