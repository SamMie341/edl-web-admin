import { Inject, Injectable } from '@nestjs/common';
import {
    APPLIANCE_PRESET_REPOSITORY,
    type IAppliancePresetRepository,
} from '../../domain/repositories/appliance-preset.repository.interface.js';

@Injectable()
export class GetAppliancePresetsUseCase {
    constructor(
        @Inject(APPLIANCE_PRESET_REPOSITORY)
        private readonly repository: IAppliancePresetRepository,
    ) { }

    async execute(categoryId?: number, search?: string) {
        return this.repository.findAll(categoryId, search);
    }
}
