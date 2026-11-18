import { Inject, Injectable } from '@nestjs/common';
import { UpdateTariffNoticeDto } from '../dtos/update-tariff-notice.dto.js';
import {
    TARIFF_SCHEDULE_REPOSITORY,
    type ITariffScheduleRepository,
} from '../../domain/repositories/tariff-schedule.repository.interface.js';

@Injectable()
export class UpdateTariffNoticeUseCase {
    constructor(
        @Inject(TARIFF_SCHEDULE_REPOSITORY)
        private readonly repository: ITariffScheduleRepository,
    ) { }

    async execute(id: number, dto: UpdateTariffNoticeDto) {
        return this.repository.updateNotice(id, dto);
    }
}
