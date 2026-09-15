
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";

@Injectable()
export class DeleteServiceCenterUseCase {
    constructor(
        @Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY)
        private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository) { }

    async execute(id: number) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ມີລະຫັດສູນບໍລິການນີ້`);
        return this.repo.delete(id);
    }
}