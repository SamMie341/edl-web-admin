import { Inject, Injectable } from "@nestjs/common";
import * as provinceRepositoryInterface from "../../domain/repositories/province.repository.interface.js";

@Injectable()
export class GetProvincesUseCase {
    constructor(@Inject(provinceRepositoryInterface.PROVINCE_REPOSITORY) private readonly provinceRepo: provinceRepositoryInterface.IProvinceRepository) { }

    async execute() {
        return this.provinceRepo.findAll();
    }
}