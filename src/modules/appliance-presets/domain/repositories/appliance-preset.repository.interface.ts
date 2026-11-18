import { AppliancePreset } from '../../../../generated/prisma/client.js';
import { CreateAppliancePresetDto } from '../../application/dtos/create-appliance-preset.dto.js';
import { UpdateAppliancePresetDto } from '../../application/dtos/update-appliance-preset.dto.js';

export const APPLIANCE_PRESET_REPOSITORY = 'APPLIANCE_PRESET_REPOSITORY';

export interface IAppliancePresetRepository {
    findAll(categoryId?: number, search?: string): Promise<AppliancePreset[]>;
    findById(id: number): Promise<AppliancePreset | null>;
    create(data: CreateAppliancePresetDto): Promise<AppliancePreset>;
    update(id: number, data: UpdateAppliancePresetDto): Promise<AppliancePreset>;
    delete(id: number): Promise<AppliancePreset>;
}
