import { Injectable, Inject } from '@nestjs/common';
import * as branchRepositoryInterface from '../../domain/repositories/branch.repository.interface.js';
import * as legacyBranchServiceInterface from '../../domain/repositories/legacy-branch.service.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';

@Injectable()
export class SyncBranchesUseCase {
    private readonly imgBaseUrl = 'https://edl-inside-api.edl.com.la/branches/';

    constructor(
        @Inject(branchRepositoryInterface.BRANCH_REPOSITORY) private readonly branchRepository: branchRepositoryInterface.IBranchRepository,
        @Inject(legacyBranchServiceInterface.LEGACY_BRANCH_SERVICE) private readonly legacyBranchService: legacyBranchServiceInterface.ILegacyBranchService,
        private readonly prisma: PrismaService,
    ) { }

    async execute() {
        // 1. ດຶງຂໍ້ມູນຈາກ API
        const branches = await this.legacyBranchService.fetchBranches();
        const syncedRecords = [];

        // 1.1 ກວດສອບ ແລະ ສ້າງ/ອັບເດດຂໍ້ມູນຝ່າຍ (Department) ເພື່ອປ້ອງກັນ Foreign Key Constraint
        for (const item of branches) {
            if (item.dept_id) {
                try {
                    const deptName = item.department?.dept_name || `Department ${item.dept_id}`;
                    await this.prisma.department.upsert({
                        where: { id: item.dept_id },
                        update: item.department?.dept_name ? { name: item.department.dept_name } : {},
                        create: {
                            id: item.dept_id,
                            name: deptName,
                        },
                    });
                } catch (deptErr: any) {
                    console.warn(`[Warning] ບໍ່ສາມາດ Sync ຝ່າຍ ID ${item.dept_id} ໄດ້:`, deptErr.message);
                }
            }
        }

        // 2. ລູບ (Loop) ເພື່ອຈັດການຂໍ້ມູນເທື່ອລະສາຂາ
        for (const item of branches) {
            // ປະກອບ URL ຮູບພາບໃຫ້ສົມບູນ ຖ້າບໍ່ມີໃຫ້ເປັນ null
            let branchImage = null;
            if (item.bra_image && typeof item.bra_image === 'string' && item.bra_image.trim()) {
                const cleanName = item.bra_image.trim();
                const url = encodeURI(`${this.imgBaseUrl}${cleanName}`);
                branchImage = await this.legacyBranchService.downlaodImage(url, cleanName);
            }

            let coverImage = null;
            if (item.co_image && typeof item.co_image === 'string' && item.co_image.trim()) {
                const cleanName = item.co_image.trim();
                const url = encodeURI(`${this.imgBaseUrl}${cleanName}`);
                coverImage = await this.legacyBranchService.downlaodImage(url, cleanName);
            }

            let orgChartImage = null;
            if (item.str_image && typeof item.str_image === 'string' && item.str_image.trim()) {
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
            try {
                const saved = await this.branchRepository.upsert(item.bra_id, dataToSave);
                syncedRecords.push(saved);
            } catch (error: any) {
                console.error(`[Error] ບໍ່ສາມາດ Sync ສາຂາ ${item.bra_name} (ID: ${item.bra_id}) ໄດ້:`, error.message);
            }
        }

        // 4. ອັບເດດ Sequence ສຳລັບ PostgreSQL Auto-increment
        try {
            await this.prisma.$executeRawUnsafe(
                `SELECT setval(pg_get_serial_sequence('departments', 'id'), COALESCE((SELECT MAX(id) FROM departments), 1))`
            );
            await this.prisma.$executeRawUnsafe(
                `SELECT setval(pg_get_serial_sequence('branches', 'id'), COALESCE((SELECT MAX(id) FROM branches), 1))`
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