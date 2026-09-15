import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { SyncVillagesUseCase } from "../application/use-cases/sync-villages.use-case.js";
import { GetVillagesUseCase } from "../application/use-cases/get-villages.use-case.js";

@UseGuards(JwtAuthGuard)
@Controller('villages')
export class VillagesController {
    constructor(
        private readonly syncVillagesUseCase: SyncVillagesUseCase,
        private readonly getVillagesUseCase: GetVillagesUseCase,
    ) { }

    @Post('sync')
    async syncData() {
        const result = await this.syncVillagesUseCase.execute();
        return {
            message: 'Sync ຂໍ້ມູນບ້ານສຳເລັດ',
            total: result.totalSynced,
            data: result.data,
        }
    }

    @Get()
    findAll() {
        return this.getVillagesUseCase.execute();
    }
}