import { Inject, Injectable } from '@nestjs/common';
import {
    APPLIANCE_PRESET_REPOSITORY,
    type IAppliancePresetRepository,
} from '../../domain/repositories/appliance-preset.repository.interface.js';
import { UpdateAppliancePresetDto } from '../dtos/update-appliance-preset.dto.js';

@Injectable()
export class UpdateAppliancePresetUseCase {
    constructor(
        @Inject(APPLIANCE_PRESET_REPOSITORY)
        private readonly repository: IAppliancePresetRepository,
    ) { }

    async execute(id: number, dto: UpdateAppliancePresetDto) {
        return this.repository.update(id, dto);
    }
}
