import { Inject, Injectable } from "@nestjs/common";
import * as provinceRepositoryInterface from "../../domain/repositories/province.repository.interface.js";
import * as hrmAddressServiceInterface from "../../domain/repositories/hrm-address.service.interface.js";

@Injectable()
export class SyncProvinceUseCase {
    constructor(
        @Inject(provinceRepositoryInterface.PROVINCE_REPOSITORY) private readonly provinceRepo: provinceRepositoryInterface.IProvinceRepository,
        @Inject(hrmAddressServiceInterface.HRM_ADDRESS_SERVICE) private readonly hrmAddressRepo: hrmAddressServiceInterface.IHrmAddressService,
    ) { }

    async execute() {
        const provinces = await this.hrmAddressRepo.fetchProvinces();
        const syncedRecords = [];

        for (const item of provinces) {
            const dataToSave = {
                name: item.province_name,
                code: item.province_code,
                shortName: item.province_short,
                branchCode: item.branch_code,
            };

            const saved = await this.provinceRepo.upsert(item.province_id, dataToSave);
            syncedRecords.push(saved);
        }

        return {
            totalSynced: syncedRecords.length,
            data: syncedRecords,
        }
    }
}