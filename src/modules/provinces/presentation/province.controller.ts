import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
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
        }
    }

    @Get()
    async findAll() {
        return this.getUseCase.execute();
    }
}