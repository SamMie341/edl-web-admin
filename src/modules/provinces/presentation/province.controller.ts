import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { Public } from "../../../core/decorators/public.decorator.js";
import { JwtAuthGuard } from "../../auth/presentation/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../../auth/presentation/guards/permissions.guard.js";
import { RequirePermission } from "../../../core/decorators/permissions.decorator.js";
import { GetProvincesUseCase } from "../application/use-cases/get-provinces.use-case.js";
import { SyncProvinceUseCase } from "../application/use-cases/sync-provinces.use-case.js";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('provinces')
export class ProvinceController {
    constructor(
        private readonly getUseCase: GetProvincesUseCase,
        private readonly syncUseCase: SyncProvinceUseCase,
    ) { }

    @Post('sync')
    @RequirePermission('PROVINCES', 'CREATE')
    async syncData() {
        const result = await this.syncUseCase.execute();
        return {
            message: 'Sync ຂໍ້ມູນແຂວງສຳເລັດ',
            total: result.totalSynced,
            data: result.data,
        };
    }

    @Public()
    @Get()
    async findAll(@Query('includeDistricts') includeDistricts?: string) {
        return this.getUseCase.execute(includeDistricts === 'true');
    }
}
