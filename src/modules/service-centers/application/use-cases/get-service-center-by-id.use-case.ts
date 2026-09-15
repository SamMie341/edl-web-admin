import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";

@Injectable()
export class GetServiceByIdUseCase {
    constructor(
        @Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY) private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository
    ) { }

    async execute(id: number) {
        const center = await this.repo.findById(id);
        if (!center) throw new NotFoundException('ບໍ່ພົບສູນບໍລິການນີ້');
        return center;
    }
}