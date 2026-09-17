import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";
import { CreateServiceCenterDto } from "../dtos/create-service-center.dto.js";
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

@Injectable()
export class CreateServiceCenterUseCase {
    constructor(
        @Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY)
        private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(dto: CreateServiceCenterDto) {
        let branchId = dto.branchId;
        let departmentId = dto.departmentId;

        // 1. ກວດສອບ ແລະ ຜູກ Branch ກັບ Department
        if (branchId) {
            const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
            if (!branch) {
                throw new BadRequestException(`ບໍ່ພົບຂໍ້ມູນສາຂາ (Branch ID: ${branchId})`);
            }
            // ຖ້າບໍ່ໄດ້ລະບຸ departmentId ຫຼື departmentId ທີ່ສົ່ງມາບໍ່ຖືກຕ້ອງ ໃຫ້ນຳໃຊ້ departmentId ຂອງສາຂານັ້ນອັດຕະໂນມັດ
            if (!departmentId) {
                departmentId = branch.departmentId;
            } else {
                const dept = await this.prisma.department.findUnique({ where: { id: departmentId } });
                if (!dept) {
                    departmentId = branch.departmentId;
                }
            }
        } else {
            // ຖ້າບໍ່ໄດ້ສົ່ງ branchId ມາ ໃຫ້ຄົ້ນຫາຕາມ Province mapping
            const mapped = DEFAULT_PROVINCE_BRANCH_MAP[dto.provinceId];
            if (mapped) {
                branchId = mapped.branchId;
                departmentId = departmentId || mapped.departmentId;
            }
        }

        // 2. ກວດສອບ Department
        if (departmentId) {
            const dept = await this.prisma.department.findUnique({ where: { id: departmentId } });
            if (!dept) {
                const firstDept = await this.prisma.department.findFirst();
                if (firstDept) {
                    departmentId = firstDept.id;
                } else {
                    throw new BadRequestException(`ບໍ່ພົບຂໍ້ມູນຝ່າຍ (Department ID: ${departmentId})`);
                }
            }
        } else {
            const firstDept = await this.prisma.department.findFirst();
            if (firstDept) {
                departmentId = firstDept.id;
            }
        }

        // 3. ກວດສອບ Branch
        if (!branchId) {
            const firstBranch = (departmentId ? await this.prisma.branch.findFirst({ where: { departmentId } }) : null) || await this.prisma.branch.findFirst();
            if (firstBranch) {
                branchId = firstBranch.id;
            } else {
                throw new BadRequestException(`ບໍ່ພົບຂໍ້ມູນສາຂາ (Branch) ສຳລັບຝ່າຍນີ້`);
            }
        }

        // 4. ກວດສອບ Province, District, Village
        if (dto.provinceId) {
            const prov = await this.prisma.province.findUnique({ where: { id: dto.provinceId } });
            if (!prov) throw new BadRequestException(`ບໍ່ພົບຂໍ້ມູນແຂວງ (Province ID: ${dto.provinceId})`);
        }
        if (dto.districtId) {
            const dist = await this.prisma.disctrict.findUnique({ where: { id: dto.districtId } });
            if (!dist) throw new BadRequestException(`ບໍ່ພົບຂໍ້ມູນເມືອງ (District ID: ${dto.districtId})`);
        }
        if (dto.villageId) {
            const vil = await this.prisma.village.findUnique({ where: { id: dto.villageId } });
            if (!vil) throw new BadRequestException(`ບໍ່ພົບຂໍ້ມູນບ້ານ (Village ID: ${dto.villageId})`);
        }

        const dataToSave = {
            ...dto,
            branchId,
            departmentId,
            latitude: dto.latitude ? parseFloat(dto.latitude.toString()) : null,
            longitude: dto.longitude ? parseFloat(dto.longitude.toString()) : null,
        };

        return this.repo.create(dataToSave);
    }
}