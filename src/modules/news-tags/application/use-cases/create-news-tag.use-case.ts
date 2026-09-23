import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as newsTagRepositoryInterface from "../../domain/repositories/news-tag.repository.interface.js";
import { CreateNewsTagDto } from "../dtos/create-news-tag.dto.js";

@Injectable()
export class CreateNewsTagUseCase {
    constructor(@Inject(newsTagRepositoryInterface.NEWS_TAG_REPOSITORY) private readonly repo: newsTagRepositoryInterface.INewsTagRepository) { }

    async execute(dto: CreateNewsTagDto) {
        const existing = await this.repo.findByNames([dto.tagName]);
        if (existing.length > 0) throw new BadRequestException(`${dto.tagName} ມີໃນລະບົບແລ້ວ`);
        return this.repo.create(dto);
    }
}