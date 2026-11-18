import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { RequirePermission } from '../../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../auth/presentation/guards/permissions.guard.js';
import { CreateTariffNoticeDto } from '../application/dtos/create-tariff-notice.dto.js';
import { UpdateTariffNoticeDto } from '../application/dtos/update-tariff-notice.dto.js';
import { UpsertTariffScheduleDto } from '../application/dtos/upsert-tariff-schedule.dto.js';
import { CreateTariffNoticeUseCase } from '../application/use-cases/create-tariff-notice.use-case.js';
import { DeleteTariffNoticeUseCase } from '../application/use-cases/delete-tariff-notice.use-case.js';
import { DeleteTariffScheduleUseCase } from '../application/use-cases/delete-tariff-schedule.use-case.js';
import { GetTariffNoticeByIdUseCase } from '../application/use-cases/get-tariff-notice-by-id.use-case.js';
import { GetTariffNoticesUseCase } from '../application/use-cases/get-tariff-notices.use-case.js';
import { UpdateTariffNoticeUseCase } from '../application/use-cases/update-tariff-notice.use-case.js';
import { UpsertTariffScheduleUseCase } from '../application/use-cases/upsert-tariff-schedule.use-case.js';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('electricity-calculator')
export class TariffSchedulesController {
    constructor(
        private readonly getNoticesUseCase: GetTariffNoticesUseCase,
        private readonly getNoticeByIdUseCase: GetTariffNoticeByIdUseCase,
        private readonly createNoticeUseCase: CreateTariffNoticeUseCase,
        private readonly updateNoticeUseCase: UpdateTariffNoticeUseCase,
        private readonly deleteNoticeUseCase: DeleteTariffNoticeUseCase,
        private readonly upsertScheduleUseCase: UpsertTariffScheduleUseCase,
        private readonly deleteScheduleUseCase: DeleteTariffScheduleUseCase,
    ) { }

    @Get('tariff-notices')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'READ')
    findAllNotices() {
        return this.getNoticesUseCase.execute();
    }

    @Get('tariff-notices/:id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'READ')
    findNoticeById(@Param('id', ParseIntPipe) id: number) {
        return this.getNoticeByIdUseCase.execute(id);
    }

    @Post('tariff-notices')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'CREATE')
    createNotice(@Body() dto: CreateTariffNoticeDto) {
        return this.createNoticeUseCase.execute(dto);
    }

    @Put('tariff-notices/:id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'UPDATE')
    updateNotice(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTariffNoticeDto,
    ) {
        return this.updateNoticeUseCase.execute(id, dto);
    }

    @Delete('tariff-notices/:id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'DELETE')
    deleteNotice(@Param('id', ParseIntPipe) id: number) {
        return this.deleteNoticeUseCase.execute(id);
    }

    @Put('schedules')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'UPDATE')
    upsertSchedule(@Body() dto: UpsertTariffScheduleDto) {
        return this.upsertScheduleUseCase.execute(dto);
    }

    @Delete('schedules/:id')
    @RequirePermission('ELECTRICITY_CALCULATOR', 'DELETE')
    deleteSchedule(@Param('id', ParseIntPipe) id: number) {
        return this.deleteScheduleUseCase.execute(id);
    }
}
