import { Inject, Injectable } from "@nestjs/common";
import * as districtRepositoryInterface from "../../domain/repositories/district.repository.interface.js";

@Injectable()
export class GetDistrictsUseCase {
    constructor(@Inject(districtRepositoryInterface.DISTRICT_REPOSITORY) private readonly districtRepo: districtRepositoryInterface.IDistrictRepository) { }

    async execute(provinceId?: number) {
        return this.districtRepo.findAll(provinceId);
    }
}