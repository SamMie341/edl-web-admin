import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Public } from '../../../core/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../auth/presentation/guards/permissions.guard.js';
import { CalculateElectricityDto } from '../application/dtos/calculate-electricity.dto.js';
import { CalculateElectricityBillUseCase } from '../application/use-cases/calculate-electricity-bill.use-case.js';
import { GetCalculatorConfigUseCase } from '../application/use-cases/get-calculator-config.use-case.js';
import { GetTariffScheduleUseCase } from '../application/use-cases/get-tariff-schedule.use-case.js';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('electricity-calculator')
export class ElectricityCalculatorController {
    constructor(
        private readonly getConfigUseCase: GetCalculatorConfigUseCase,
        private readonly getScheduleUseCase: GetTariffScheduleUseCase,
        private readonly calculateBillUseCase: CalculateElectricityBillUseCase,
    ) { }

    /**
     * 1. ດຶງຂໍ້ມູນຕັ້ງຕົ້ນທັງໝົດສຳລັບໜ້າເວັບຄິດໄລ່ຄ່າໄຟ (Public)
     */
    @Public()
    @Get('config')
    getConfig() {
        return this.getConfigUseCase.execute();
    }

    /**
     * 2. ດຶງຕາຕະລາງອັດຕາຄ່າໄຟຂັ້ນບັນໄດ (8 ຂັ້ນ) ຕາມປີ ແລະ ເດືອນທີ່ເລືອກ (Public)
     */
    @Public()
    @Get('schedules')
    getSchedule(
        @Query('year') year?: string,
        @Query('month') month?: string,
        @Query('categoryId') categoryId?: string,
        @Query('category') category?: string,
    ) {
        const yearNum = year ? parseInt(year, 10) : 2026;
        const monthNum = month ? parseInt(month, 10) : 11;
        const catIdStr = categoryId ?? category;
        const catIdNum = catIdStr ? parseInt(catIdStr, 10) : undefined;
        return this.getScheduleUseCase.execute(yearNum, monthNum, catIdNum);
    }

    /**
     * 3. ຄິດໄລ່ຄ່າໄຟຟ້າຂັ້ນບັນໄດ + ແຜນປະຢັດໄຟອັດຕະໂນມັດ + ຄາດການລາຍປີ (2026–2029) (Public)
     */
    @Public()
    @Post('calculate')
    @HttpCode(HttpStatus.OK)
    calculate(@Body() dto: CalculateElectricityDto) {
        return this.calculateBillUseCase.execute(dto);
    }
}
