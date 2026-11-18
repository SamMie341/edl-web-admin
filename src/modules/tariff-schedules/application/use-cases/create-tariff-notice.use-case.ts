import { Inject, Injectable } from '@nestjs/common';
import { CreateTariffNoticeDto } from '../dtos/create-tariff-notice.dto.js';
import {
    TARIFF_SCHEDULE_REPOSITORY,
    type ITariffScheduleRepository,
} from '../../domain/repositories/tariff-schedule.repository.interface.js';

@Injectable()
export class CreateTariffNoticeUseCase {
    constructor(
        @Inject(TARIFF_SCHEDULE_REPOSITORY)
        private readonly repository: ITariffScheduleRepository,
    ) { }

    async execute(dto: CreateTariffNoticeDto) {
        return this.repository.createNotice(dto);
    }
}
