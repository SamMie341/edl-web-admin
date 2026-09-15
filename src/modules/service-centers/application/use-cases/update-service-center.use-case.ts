import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";
import { UpdateServiceCenterDto } from "../dtos/update-service-center.dto.js";

@Injectable()
export class UpdateServiceCenterUseCase {
    constructor(
        @Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY)
        private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository
    ) { }

    async execute(id: number, dto: UpdateServiceCenterDto) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ມີລະຫັດສູນບໍລິການນີ້`);
        const dataToUpdate = {
            ...dto,
            ...(dto.latitude && { latitude: parseFloat(dto.latitude.toString()) }),
            ...(dto.longitude && { longitude: parseFloat(dto.longitude.toString()) })
        };
        return this.repo.update(id, dataToUpdate);
    }
}