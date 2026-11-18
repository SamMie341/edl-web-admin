import { Inject, Injectable } from '@nestjs/common';
import {
    APPLIANCE_PRESET_REPOSITORY,
    type IAppliancePresetRepository,
} from '../../domain/repositories/appliance-preset.repository.interface.js';

@Injectable()
export class DeleteAppliancePresetUseCase {
    constructor(
        @Inject(APPLIANCE_PRESET_REPOSITORY)
        private readonly repository: IAppliancePresetRepository,
    ) { }

    async execute(id: number) {
        return this.repository.delete(id);
    }
}
