import { Controller, Get, Post, UseGuards } from "@nestjs/common";
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
        }
    }

    @Get()
    async findAll() {
        return await this.getUseCase.execute();
    }
}