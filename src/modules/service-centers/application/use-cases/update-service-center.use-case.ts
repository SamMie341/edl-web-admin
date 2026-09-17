import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as serviceCenterRepositoryInterface from "../../domain/repositories/service-center.repository.interface.js";
import { UpdateServiceCenterDto } from "../dtos/update-service-center.dto.js";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class UpdateServiceCenterUseCase {
    constructor(
        @Inject(serviceCenterRepositoryInterface.SERVICE_CENTER_REPOSITORY)
        private readonly repo: serviceCenterRepositoryInterface.IServiceCenterRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(id: number, dto: UpdateServiceCenterDto) {
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`ບໍ່ມີລະຫັດສູນບໍລິການນີ້`);

        let departmentId = dto.departmentId;
        if (dto.branchId) {
            const branch = await this.prisma.branch.findUnique({ where: { id: dto.branchId } });
            if (!branch) throw new BadRequestException(`ບໍ່ພົບຂໍ້ມູນສາຂາ (Branch ID: ${dto.branchId})`);
            if (!departmentId) {
                departmentId = branch.departmentId;
            }
        }
        if (departmentId) {
            const dept = await this.prisma.department.findUnique({ where: { id: departmentId } });
            if (!dept) throw new BadRequestException(`ບໍ່ພົບຂໍ້ມູນຝ່າຍ (Department ID: ${departmentId})`);
        }

        const dataToUpdate = {
            ...dto,
            ...(departmentId && { departmentId }),
            ...(dto.latitude && { latitude: parseFloat(dto.latitude.toString()) }),
            ...(dto.longitude && { longitude: parseFloat(dto.longitude.toString()) })
        };
        return this.repo.update(id, dataToUpdate);
    }
}