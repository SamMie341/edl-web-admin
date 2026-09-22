import { Inject, Injectable } from "@nestjs/common";
import * as magazineRepositoryInterface from "../../domain/repositories/magazine.repository.interface.js";

@Injectable()
export class GetMagazinesUseCase {
    constructor(
        @Inject(magazineRepositoryInterface.MAGAZINE_REPOSITORY)
        private readonly repo: magazineRepositoryInterface.IMagazineRepository,
    ) { }

    async execute() {
        return this.repo.findAll();
    }
}