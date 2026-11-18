import { Inject, Injectable } from '@nestjs/common';
import {
    APPLIANCE_PRESET_REPOSITORY,
    type IAppliancePresetRepository,
} from '../../domain/repositories/appliance-preset.repository.interface.js';
import { CreateAppliancePresetDto } from '../dtos/create-appliance-preset.dto.js';

@Injectable()
export class CreateAppliancePresetUseCase {
    constructor(
        @Inject(APPLIANCE_PRESET_REPOSITORY)
        private readonly repository: IAppliancePresetRepository,
    ) { }

    async execute(dto: CreateAppliancePresetDto) {
        return this.repository.create(dto);
    }
}
