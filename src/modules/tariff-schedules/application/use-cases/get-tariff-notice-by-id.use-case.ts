import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    TARIFF_SCHEDULE_REPOSITORY,
    type ITariffScheduleRepository,
} from '../../domain/repositories/tariff-schedule.repository.interface.js';

@Injectable()
export class GetTariffNoticeByIdUseCase {
    constructor(
        @Inject(TARIFF_SCHEDULE_REPOSITORY)
        private readonly repository: ITariffScheduleRepository,
    ) { }

    async execute(id: number) {
        const item = await this.repository.findNoticeById(id);
        if (!item) {
            throw new NotFoundException(`Tariff notice ID ${id} not found`);
        }
        return item;
    }
}
