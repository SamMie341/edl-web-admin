import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";
import { SERVICE_CENTER_REPOSITORY } from "../../domain/repositories/service-center.repository.interface.js";
import * as legacyCenterServiceInterface from "../../domain/repositories/legacy-center.service.interface.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

const DEFAULT_PROVINCE_BRANCH_MAP: Record<number, { branchId: number; departmentId: number }> = {
    1: { branchId: 44, departmentId: 5 },
    2: { branchId: 43, departmentId: 4 },
    3: { branchId: 39, departmentId: 4 },
    4: { branchId: 40, departmentId: 4 },
    5: { branchId: 38, departmentId: 4 },
    6: { branchId: 35, departmentId: 4 },
    7: { branchId: 36, departmentId: 4 },
    8: { branchId: 41, departmentId: 4 },
    9: { branchId: 37, departmentId: 4 },
    10: { branchId: 34, departmentId: 5 },
    11: { branchId: 33, departmentId: 5 },
    12: { branchId: 28, departmentId: 6 },
    13: { branchId: 25, departmentId: 6 },
    14: { branchId: 24, departmentId: 6 },
    15: { branchId: 21, departmentId: 6 },
    16: { branchId: 23, departmentId: 6 },
    17: { branchId: 19, departmentId: 6 },
    18: { branchId: 31, departmentId: 5 },
};

function cleanText(str?: string | null): string {
    if (!str) return '';
    return str.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

function parseCoordinate(val: any): number | null {
    if (val === undefined || val === null) return null;
    if (typeof val === 'number') return isNaN(val) ? null : val;
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (!trimmed) return null;
        const num = parseFloat(trimmed);
        return isNaN(num) ? null : num;
    }
    return null;
}

@Injectable()
export class SyncServiceCenterUseCase {
    private readonly imageBaseUrl = 'https://edl-inside-api.edl.com.la/centers/';
    constructor(
        @Inject(SERVICE_CENTER_REPOSITORY) private readonly repository: serviceCenterRepositoryInterface.IServiceCenterRepository,
        @Inject(legacyCenterServiceInterface.LEGACY_CENTER_SERVICE) private readonly legacyService: legacyCenterServiceInterface.ILegacyCenterService,
        private readonly prisma: PrismaService,
    ) { }

    async execute() {
        // 1. ກວດສອບຄວາມພ້ອມຂອງຂໍ້ມູນຫຼັກ: ແຂວງ (Provinces), ເມືອງ (Districts), ບ້ານ (Villages)
        const [provinceCount, districtCount, villageCount] = await Promise.all([
            this.prisma.province.count(),
            this.prisma.disctrict.count(),
            this.prisma.village.count(),
        ]);

        const missingMasters: string[] = [];
        if (provinceCount === 0) missingMasters.push('ແຂວງ (Provinces)');
        if (districtCount === 0) missingMasters.push('ເມືອງ (Districts)');
        if (villageCount === 0) missingMasters.push('ບ້ານ (Villages)');

        if (missingMasters.length > 0) {
            throw new BadRequestException(
                `ບໍ່ສາມາດ Sync ຂໍ້ມູນສູນບໍລິການໄດ້ ເນື່ອງຈາກຍັງບໍ່ມີຂໍ້ມູນ ${missingMasters.join(', ')} ໃນລະບົບ. ກະລຸນາ Sync ຫຼື ນຳເຂົ້າຂໍ້ມູນດັ່ງກ່າວກ່ອນດຳເນີນການ!`
            );
        }

        const [provinces, districts, villages, branches] = await Promise.all([
            this.prisma.province.findMany(),
            this.prisma.disctrict.findMany(),
            this.prisma.village.findMany({ select: { id: true } }),
            this.prisma.branch.findMany(),
        ]);

        const provinceMap = new Map(provinces.map((p) => [p.id, p]));
        const districtMap = new Map(districts.map((d) => [d.id, d]));
        const districtByCode = new Map(districts.filter((d) => d.code).map((d) => [d.code!, d]));
        const villageSet = new Set(villages.map((v) => v.id));

        const syncedRecords = [];
        const failedRecords: { centerId: number; centerName: string; reason: string }[] = [];

        const getBranchAndDept = (provinceId: number, provinceName: string, districtId?: number) => {
            if (provinceId === 1) {
                const isBranch2 = districtId && [6, 7, 9].includes(districtId);
                const targetName = isBranch2 ? 'ສາຂາ ແຂວງນະຄອນຫຼວງ 2' : 'ສາຂາ ແຂວງນະຄອນຫຼວງ 1';
                const found = branches.find((b) => cleanText(b.branchName) === cleanText(targetName));
                if (found) return { branchId: found.id, departmentId: found.departmentId };
                return { branchId: isBranch2 ? 46 : 44, departmentId: 5 };
            }

            const cleanedProv = cleanText(provinceName);
            const found = branches.find((b) => {
                const cleanedBranch = cleanText(b.branchName);
                return cleanedBranch.includes(cleanedProv) || cleanedProv.includes(cleanedBranch.replace('ສາຂາ ແຂວງ', '').trim());
            });

            if (found) {
                return { branchId: found.id, departmentId: found.departmentId };
            }

            return DEFAULT_PROVINCE_BRANCH_MAP[provinceId] || { branchId: 44, departmentId: 5 };
        };

        for (const province of provinces) {
            let centers: any[] = [];
            try {
                centers = await this.legacyService.fetchCentersByProvince(province.id);
            } catch (fetchError: any) {
                console.warn(`[Warning] ບໍ່ສາມາດດຶງຂໍ້ມູນສູນບໍລິການແຂວງ ID ${province.id}:`, fetchError.message);
                continue;
            }

            if (!centers || !Array.isArray(centers) || centers.length === 0) {
                continue;
            }

            for (const item of centers) {
                try {
                    // ກວດສອບຄວາມຖືກຕ້ອງຂອງ ແຂວງ (Province)
                    if (!provinceMap.has(item.province_id)) {
                        const reason = `ບໍ່ພົບຂໍ້ມູນແຂວງ ID: ${item.province_id} (${item.province?.province_name || ''}) ໃນລະບົບ`;
                        console.warn(`[Warning] ຂ້າມສູນ ${item.center_name} (ID: ${item.center_id}): ${reason}`);
                        failedRecords.push({ centerId: item.center_id, centerName: item.center_name, reason });
                        continue;
                    }

                    // ກວດສອບ ແລະ ຈັບຄູ່ລະຫັດເມືອງ (District ID)
                    let districtId = item.district_id;
                    // ກໍລະນີພິເສດ: ສູນ 143 (ເມືອງບໍ່ແຕນ ແຂວງໄຊຍະບູລີ ລະຫັດເກົ່າ 648 ຫຼື ລະຫັດ 809 -> ID 64)
                    if (districtId === 648 || (item.village?.district_code === '809' && districtId !== 64)) {
                        districtId = 64;
                    }

                    if (!districtMap.has(districtId)) {
                        const code = item.district?.district_code || item.village?.district_code;
                        if (code && districtByCode.has(code)) {
                            districtId = districtByCode.get(code)!.id;
                        }
                    }

                    if (!districtMap.has(districtId)) {
                        const reason = `ບໍ່ພົບຂໍ້ມູນເມືອງ ID: ${item.district_id} (${item.district?.district_name || ''}) ໃນລະບົບ`;
                        console.warn(`[Warning] ຂ້າມສູນ ${item.center_name} (ID: ${item.center_id}): ${reason}`);
                        failedRecords.push({ centerId: item.center_id, centerName: item.center_name, reason });
                        continue;
                    }

                    // ກວດສອບຂໍ້ມູນບ້ານ (Village)
                    if (!item.village_id || !villageSet.has(item.village_id)) {
                        const reason = `ບໍ່ພົບຂໍ້ມູນບ້ານ ID: ${item.village_id} (${item.village?.village_name || ''}) ໃນລະບົບ`;
                        console.warn(`[Warning] ຂ້າມສູນ ${item.center_name} (ID: ${item.center_id}): ${reason}`);
                        failedRecords.push({ centerId: item.center_id, centerName: item.center_name, reason });
                        continue;
                    }

                    // ກຳນົດ ສາຂາ (Branch) ແລະ ຝ່າຍ (Department)
                    const { branchId, departmentId } = getBranchAndDept(province.id, province.name, districtId);

                    // ດາວໂຫຼດຮູບພາບປະກອບ (ຖ້າມີ)
                    let imagePath = null;
                    if (item.center_image && typeof item.center_image === 'string' && item.center_image.trim()) {
                        const cleanName = item.center_image.trim();
                        const url = encodeURI(`${this.imageBaseUrl}${cleanName}`);
                        imagePath = await this.legacyService.downloadImage(url, cleanName);
                    }

                    const status = item.center_status === 'A' ? 'ACTIVE' : 'INACTIVE';

                    const dataToSave = {
                        departmentId,
                        branchId,
                        centerName: item.center_name ? item.center_name.trim() : '',
                        imageUrl: imagePath,
                        phoneNumber: item.center_tel ? item.center_tel.trim() : null,
                        status: status as any,
                        latitude: parseCoordinate(item.latitude),
                        longitude: parseCoordinate(item.longtitude),
                        provinceId: item.province_id,
                        districtId: districtId,
                        villageId: item.village_id,
                    };

                    const saved = await this.repository.upsert(item.center_id, dataToSave);
                    syncedRecords.push(saved);
                } catch (error: any) {
                    const reason = error.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ';
                    console.warn(`[Warning] ບໍ່ສາມາດ Sync ສູນ ${item.center_name} (ID: ${item.center_id}) ໄດ້:`, reason);
                    failedRecords.push({ centerId: item.center_id, centerName: item.center_name, reason });
                }
            }
        }

        // ອັບເດດ Sequence ສຳລັບ PostgreSQL Auto-increment
        try {
            await this.prisma.$executeRawUnsafe(
                `SELECT setval(pg_get_serial_sequence('service_centers', 'id'), COALESCE((SELECT MAX(id) FROM service_centers), 1))`
            );
        } catch (seqError: any) {
            console.warn('[Warning] ບໍ່ສາມາດອັບເດດ Sequence ໄດ້:', seqError.message);
        }

        return {
            totalSynced: syncedRecords.length,
            totalFailed: failedRecords.length,
            data: syncedRecords,
            failed: failedRecords,
        };
    }
}
