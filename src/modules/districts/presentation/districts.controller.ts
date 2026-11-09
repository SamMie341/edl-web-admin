import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { Public } from "../../../core/decorators/public.decorator.js";
import { JwtAuthGuard } from "../../auth/presentation/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../../auth/presentation/guards/permissions.guard.js";
import { RequirePermission } from "../../../core/decorators/permissions.decorator.js";
import { SyncDistrictsUseCase } from "../application/use-cases/sync-districts.use-case.js";
import { GetDistrictsUseCase } from "../application/use-cases/get-districts.use-case.js";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('districts')
export class DistrictsController {
    constructor(
        private readonly syncUseCase: SyncDistrictsUseCase,
        private readonly getUseCase: GetDistrictsUseCase,
    ) { }

    @Post('sync')
    @RequirePermission('DISTRICTS', 'CREATE')
    async syncData() {
        const result = await this.syncUseCase.execute();
        return {
            message: 'Sync ຂໍ້ມູນເມືອງສຳເລັດ',
            total: result.totalSynced,
            data: result.data,
        };
    }

    @Public()
    @Get()
    async findAll(@Query('provinceId') provinceId?: string) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        return await this.getUseCase.execute(parsedProvinceId);
    }

    @Public()
    @Get('province/:provinceId')
    async findByProvince(@Param('provinceId', ParseIntPipe) provinceId: number) {
        return await this.getUseCase.execute(provinceId);
    }
}
