import { Inject, Injectable } from '@nestjs/common';
import { UpsertTariffScheduleDto } from '../dtos/upsert-tariff-schedule.dto.js';
import {
    TARIFF_SCHEDULE_REPOSITORY,
    type ITariffScheduleRepository,
} from '../../domain/repositories/tariff-schedule.repository.interface.js';

@Injectable()
export class UpsertTariffScheduleUseCase {
    constructor(
        @Inject(TARIFF_SCHEDULE_REPOSITORY)
        private readonly repository: ITariffScheduleRepository,
    ) { }

    async execute(dto: UpsertTariffScheduleDto) {
        return this.repository.upsertScheduleWithTiers(dto);
    }
}
