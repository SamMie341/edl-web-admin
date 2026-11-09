import { Inject, Injectable } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";

@Injectable()
export class GetServiceUseCase {
    constructor(
        @Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY) private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository,
    ) { }

    async execute(provinceId?: number, page: number = 1, limit: number = 10) {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
        return this.repo.findAll(provinceId, validPage, validLimit);
    }
}
