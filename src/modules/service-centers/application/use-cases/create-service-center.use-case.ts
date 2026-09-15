import { Inject, Injectable } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";
import { CreateServiceCenterDto } from "../dtos/create-service-center.dto.js";

@Injectable()
export class CreateServiceCenterUseCase {
    constructor
        (@Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY)
        private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository) { }

    async execute(dto: CreateServiceCenterDto) {
        const dataToSave = {
            ...dto,
            latitude: dto.latitude ? parseFloat(dto.latitude.toString()) : null,
            longitude: dto.longitude ? parseFloat(dto.longitude.toString()) : null,
        }
        return this.repo.create(dataToSave);
    }
}