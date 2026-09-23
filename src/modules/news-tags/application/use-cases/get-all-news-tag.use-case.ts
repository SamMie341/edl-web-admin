import { Inject, Injectable } from "@nestjs/common";
import * as newsTagRepositoryInterface from "../../domain/repositories/news-tag.repository.interface.js";

@Injectable()
export class GetAllNewsTagUseCase {
    constructor(
        @Inject(newsTagRepositoryInterface.NEWS_TAG_REPOSITORY)
        private readonly repo: newsTagRepositoryInterface.INewsTagRepository
    ) { }

    async execute() {
        return this.repo.findAll();
    }
}