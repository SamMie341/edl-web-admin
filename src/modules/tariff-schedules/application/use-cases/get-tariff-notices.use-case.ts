import { Inject, Injectable } from '@nestjs/common';
import {
    TARIFF_SCHEDULE_REPOSITORY,
    type ITariffScheduleRepository,
} from '../../domain/repositories/tariff-schedule.repository.interface.js';

@Injectable()
export class GetTariffNoticesUseCase {
    constructor(
        @Inject(TARIFF_SCHEDULE_REPOSITORY)
        private readonly repository: ITariffScheduleRepository,
    ) { }

    async execute() {
        return this.repository.findAllNotices();
    }
}
