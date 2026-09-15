import { Inject, Injectable } from "@nestjs/common";
import * as districtRepositoryInterface from "../../domain/repositories/district.repository.interface.js";
import * as hrmDistrictServiceInterface from "../../domain/repositories/hrm-district.service.interface.js";

@Injectable()
export class SyncDistrictsUseCase {
    constructor(
        @Inject(districtRepositoryInterface.DISTRICT_REPOSITORY) private readonly districtRepo: districtRepositoryInterface.IDistrictRepository,
        @Inject(hrmDistrictServiceInterface.HRM_DISTRICT_SERVICE) private readonly hrmDistrictRepo: hrmDistrictServiceInterface.IHrmDistrictService,
    ) { }

    async execute() {
        const districts = await this.hrmDistrictRepo.fetchDistricts();
        const syncedRecords = [];

        for (const item of districts) {
            const provinceId = item.province?.province_id || parseInt(item.province_code, 10);
            const dataToSave = {
                provinceId: provinceId,
                code: item.district_code,
                name: item.district_name,
                nameEn: item.district_name_en,
                status: item.district_status,
            };

            try {
                const saved = await this.districtRepo.upsert(item.district_id, dataToSave);
                syncedRecords.push(saved);
            } catch (error) {
                console.warn(`[Warning] ບໍ່ສາມາດ Sync ເມືອງ ${item.district_name} ໄດ້ ເນື່ອງຈາກບໍ່ພົບລະຫັດແຂວງ ${provinceId} ໃນລະບົບ`);
            }
        }

        return {
            totalSynced: syncedRecords.length,
            data: syncedRecords,
        };
    }
}