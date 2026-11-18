import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    APPLIANCE_PRESET_REPOSITORY,
    type IAppliancePresetRepository,
} from '../../domain/repositories/appliance-preset.repository.interface.js';

@Injectable()
export class GetAppliancePresetByIdUseCase {
    constructor(
        @Inject(APPLIANCE_PRESET_REPOSITORY)
        private readonly repository: IAppliancePresetRepository,
    ) { }

    async execute(id: number) {
        const item = await this.repository.findById(id);
        if (!item) {
            throw new NotFoundException(`Appliance preset ID ${id} not found`);
        }
        return item;
    }
}
