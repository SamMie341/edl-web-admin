import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CalculateElectricityBillUseCase } from './application/use-cases/calculate-electricity-bill.use-case.js';
import { GetCalculatorConfigUseCase } from './application/use-cases/get-calculator-config.use-case.js';
import { GetTariffScheduleUseCase } from './application/use-cases/get-tariff-schedule.use-case.js';
import { ELECTRICITY_CALCULATOR_REPOSITORY } from './domain/repositories/electricity-calculator.repository.interface.js';
import { ElectricityCalculationEngineService } from './domain/services/electricity-calculation-engine.service.js';
import { PrismaElectricityCalculatorRepository } from './infrastructure/database/prisma-electricity-calculator.repository.js';
import { ElectricityCalculatorController } from './presentation/electricity-calculator.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [ElectricityCalculatorController],
    providers: [
        ElectricityCalculationEngineService,
        GetCalculatorConfigUseCase,
        GetTariffScheduleUseCase,
        CalculateElectricityBillUseCase,
        {
            provide: ELECTRICITY_CALCULATOR_REPOSITORY,
            useClass: PrismaElectricityCalculatorRepository,
        },
    ],
    exports: [
        ElectricityCalculationEngineService,
        ELECTRICITY_CALCULATOR_REPOSITORY,
        CalculateElectricityBillUseCase,
        GetCalculatorConfigUseCase,
        GetTariffScheduleUseCase,
    ],
})
export class ElectricityCalculatorModule { }
