import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { HttpModule } from "@nestjs/axios";
import { ProvinceController } from "./presentation/province.controller.js";
import { SyncProvinceUseCase } from "./application/use-cases/sync-provinces.use-case.js";
import { GetProvincesUseCase } from "./application/use-cases/get-provinces.use-case.js";
import { PROVINCE_REPOSITORY } from "./domain/repositories/province.repository.interface.js";
import { PrismaProvinceRepository } from "./infrastructure/database/prisma-province.repository.js";
import { HRM_ADDRESS_SERVICE } from "./domain/repositories/hrm-address.service.interface.js";
import { HrmAddressService } from "./infrastructure/external/hrm-address.service.js";

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [ProvinceController],
    providers: [
        SyncProvinceUseCase,
        GetProvincesUseCase,
        {
            provide: PROVINCE_REPOSITORY,
            useClass: PrismaProvinceRepository,
        },
        {
            provide: HRM_ADDRESS_SERVICE,
            useClass: HrmAddressService,
        }
    ]
})
export class ProvincesModule { }