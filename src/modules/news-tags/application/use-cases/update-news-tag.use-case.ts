import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as newsTagRepositoryInterface from "../../domain/repositories/news-tag.repository.interface.js";
import { UpdateNewsTagDto } from "../dtos/update-news-tag.dto.js";

@Injectable()
export class UpdateNewsTagUseCase {
    constructor(
        @Inject(newsTagRepositoryInterface.NEWS_TAG_REPOSITORY) private readonly repo: newsTagRepositoryInterface.INewsTagRepository
    ) { }

    async execute(id: number, dto: UpdateNewsTagDto) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException('ບໍ່ພົບ Tag');
        return this.repo.update(id, dto);
    }
}