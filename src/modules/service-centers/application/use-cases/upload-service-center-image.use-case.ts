import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";

@Injectable()
export class UploadServiceCenterImageUseCase {
    constructor(
        @Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY) private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository,
    ) { }

    async execute(id: number, filePath: string) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ພົບສູນບໍລິການ`);
        const dataToUpdate = { imageUrl: filePath };
        return this.repo.update(id, dataToUpdate);
    }
}