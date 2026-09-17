import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { SyncDistrictsUseCase } from "../application/use-cases/sync-districts.use-case.js";
import { GetDistrictsUseCase } from "../application/use-cases/get-districts.use-case.js";

@UseGuards(JwtAuthGuard)
@Controller('districts')
export class DistrictsController {
    constructor(
        private readonly syncUseCase: SyncDistrictsUseCase,
        private readonly getUseCase: GetDistrictsUseCase,
    ) { }

    @Post('sync')
    async syncData() {
        const result = await this.syncUseCase.execute();
        return {
            message: 'Sync ຂໍ້ມູນເມືອງສຳເລັດ',
            total: result.totalSynced,
            data: result.data,
        };
    }

    @Get()
    async findAll(@Query('provinceId') provinceId?: string) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        return await this.getUseCase.execute(parsedProvinceId);
    }

    @Get('province/:provinceId')
    async findByProvince(@Param('provinceId', ParseIntPipe) provinceId: number) {
        return await this.getUseCase.execute(provinceId);
    }
}