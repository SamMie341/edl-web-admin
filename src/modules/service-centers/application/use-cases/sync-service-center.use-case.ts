import { Inject, Injectable } from "@nestjs/common";
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

function cleanText(str: string): string {
    return str.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
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
        const provinces = await this.prisma.province.findMany();
        const branches = await this.prisma.branch.findMany();
        const districts = await this.prisma.disctrict.findMany();
        const districtMap = new Map(districts.map((d) => [d.id, d]));
        const districtByCode = new Map(districts.filter((d) => d.code).map((d) => [d.code!, d]));
        const syncedRecords = [];

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
            const centers = await this.legacyService.fetchCentersByProvince(province.id);

            for (const item of centers) {
                let imagePath = null;
                if (item.center_image) {
                    const cleanName = item.center_image.trim();
                    const url = encodeURI(`${this.imageBaseUrl}${cleanName}`);
                    imagePath = await this.legacyService.downloadImage(url, cleanName);
                }

                let districtId = item.district_id;
                if (!districtMap.has(districtId)) {
                    if (item.village?.district_code && districtByCode.has(item.village.district_code)) {
                        districtId = districtByCode.get(item.village.district_code)!.id;
                    } else if (item.village_id) {
                        const village = await this.prisma.village.findUnique({ where: { id: item.village_id } });
                        if (village?.districtId) {
                            districtId = village.districtId;
                        }
                    }
                }

                const status = item.center_status === 'A' ? 'ACTIVE' : 'INACTIVE';
                const { branchId, departmentId } = getBranchAndDept(province.id, province.name, districtId);

                const dataToSave = {
                    departmentId,
                    branchId,
                    centerName: item.center_name ? item.center_name.trim() : '',
                    imageUrl: imagePath,
                    phoneNumber: item.center_tel ? item.center_tel.trim() : null,
                    status: status,
                    latitude: item.latitude ? parseFloat(item.latitude) : null,
                    longitude: item.longtitude ? parseFloat(item.longtitude) : null,
                    provinceId: item.province_id,
                    districtId: districtId,
                    villageId: item.village_id,
                };

                try {
                    const saved = await this.repository.upsert(item.center_id, dataToSave);
                    syncedRecords.push(saved);
                } catch (error: any) {
                    console.warn(`[Warning] ບໍ່ສາມາດ Sync ສູນ ${item.center_name} ໄດ້`, error.message);
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
            data: syncedRecords,
        };
    }
}