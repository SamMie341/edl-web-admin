import { Injectable, Inject } from '@nestjs/common';
import * as branchRepositoryInterface from '../../domain/repositories/branch.repository.interface.js';
import * as legacyBranchServiceInterface from '../../domain/repositories/legacy-branch.service.interface.js';

@Injectable()
export class SyncBranchesUseCase {
    private readonly imgBaseUrl = 'https://edl-inside-api.edl.com.la/branches/';

    constructor(
        @Inject(branchRepositoryInterface.BRANCH_REPOSITORY) private readonly branchRepository: branchRepositoryInterface.IBranchRepository,
        @Inject(legacyBranchServiceInterface.LEGACY_BRANCH_SERVICE) private readonly legacyBranchService: legacyBranchServiceInterface.ILegacyBranchService,
    ) { }

    async execute() {
        // 1. ດຶງຂໍ້ມູນຈາກ API
        const branches = await this.legacyBranchService.fetchBranches();
        const syncedRecords = [];

        // 2. ລູບ (Loop) ເພື່ອຈັດການຂໍ້ມູນເທື່ອລະສາຂາ
        for (const item of branches) {
            // ປະກອບ URL ຮູບພາບໃຫ້ສົມບູນ ຖ້າບໍ່ມີໃຫ້ເປັນ null
            let branchImage = null;
            if (item.bra_name) {
                const cleanName = item.bra_image.trim();
                const url = encodeURI(`${this.imgBaseUrl}${cleanName}`);
                branchImage = await this.legacyBranchService.downlaodImage(url, cleanName);
            }

            let coverImage = null;
            if (item.co_image) {
                const cleanName = item.co_image.trim();
                const url = encodeURI(`${this.imgBaseUrl}${cleanName}`)
                coverImage = await this.legacyBranchService.downlaodImage(url, cleanName);
            }
            let orgChartImage = null;
            if (item.str_image) {
                const cleanName = item.str_image.trim();
                const url = encodeURI(`${this.imgBaseUrl}${cleanName}`);
                orgChartImage = await this.legacyBranchService.downlaodImage(url, cleanName);
            }

            const status = item.status === 'A' ? 'ACTIVE' : 'INACTIVE';

            // ຈັດລຽງຂໍ້ມູນໃຫ້ກົງກັບ Schema Prisma ໃໝ່
            const dataToSave = {
                departmentId: item.dept_id,
                branchName: item.bra_name,
                branchImage: branchImage,
                coverImage: coverImage,
                orgChartImage: orgChartImage,
                address: item.address,
                locationCoordinates: item.location,
                email: item.email,
                phoneNumber: item.phone_number,
                roleResponsibilities: item.mission,
                orderIndex: item.number || 0,
                status: status,
            };

            // 3. ບັນທຶກລົງຖານຂໍ້ມູນ (ຮັກສາ id ເດີມໄວ້)
            const saved = await this.branchRepository.upsert(item.bra_id, dataToSave);
            syncedRecords.push(saved);
        }

        return {
            totalSynced: syncedRecords.length,
            data: syncedRecords,
        };
    }
}