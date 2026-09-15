import { Inject, Injectable } from "@nestjs/common";
import * as villageRepositoryInterface from "../../domain/repositories/village.repository.interface.js";
import * as hrmVillageServiceInterface from "../../domain/repositories/hrm-village.service.interface.js";

@Injectable()
export class SyncVillagesUseCase {
    constructor(
        @Inject(villageRepositoryInterface.VILLAGE_REPOSITORY) private readonly villageRepository: villageRepositoryInterface.IVillageRepository,
        @Inject(hrmVillageServiceInterface.HRM_VILLAGE_SERVICE) private readonly hrmVillageService: hrmVillageServiceInterface.IHrmVillageService,
    ) { }

    async execute() {
        const villages = await this.hrmVillageService.fetchVillage();
        const syncedRecords = [];

        for (const item of villages) {
            const districtId = item.district?.district_id;

            if (!districtId) {
                console.warn(`[Warning] ຂ້າມບ້ານ${item.village_name} ເນື່ອງຈາກບໍ່ມີຂໍ້ມູນແຂວງ`);
                continue;
            }

            const dataToSave = {
                districtId: districtId,
                code: item.village_code,
                name: item.village_name,
                nameEn: item.village_name_en,
                status: item.village_status,
            };

            try {
                const saved = await this.villageRepository.upsert(item.village_id, dataToSave);
                syncedRecords.push(saved);
            } catch (error) {
                console.warn(`[Warning] ບໍ່ສາມາດ Sync ບ້ານ ${item.village_name} ໄດ້ ເນື່ອງຈາກບໍ່ພົບເມືອງ ${item.district?.district_name}`);
            }
        }
        return {
            totalSynced: syncedRecords.length,
            data: syncedRecords,
        }
    }
}