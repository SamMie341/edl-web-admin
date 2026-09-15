import { Inject, Injectable } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";

@Injectable()
export class GetServiceUseCase {
    constructor(
        @Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY) private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository,
    ) { }

    async execute() {
        return this.repo.findAll();
    }
}