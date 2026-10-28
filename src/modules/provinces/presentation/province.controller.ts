import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { Public } from "../../../core/decorators/public.decorator.js";
import { JwtAuthGuard } from "../../auth/presentation/guards/jwt-auth.guard.js";
import { GetProvincesUseCase } from "../application/use-cases/get-provinces.use-case.js";
import { SyncProvinceUseCase } from "../application/use-cases/sync-provinces.use-case.js";

@UseGuards(JwtAuthGuard)
@Controller('provinces')
export class ProvinceController {
    constructor(
        private readonly getUseCase: GetProvincesUseCase,
        private readonly syncUseCase: SyncProvinceUseCase,
    ) { }

    @Post('sync')
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