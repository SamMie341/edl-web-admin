import {
    ApplianceCategory,
    AppliancePreset,
    SavingActionTemplate,
} from '../../../../generated/prisma/client.js';
import { CreateApplianceCategoryDto } from '../../application/dtos/create-appliance-category.dto.js';
import { UpdateApplianceCategoryDto } from '../../application/dtos/update-appliance-category.dto.js';

export const APPLIANCE_CATEGORY_REPOSITORY = 'APPLIANCE_CATEGORY_REPOSITORY';

export type CategoryWithPresetsAndTemplates = ApplianceCategory & {
    presets: AppliancePreset[];
    actionTemplates: SavingActionTemplate[];
};

export interface IApplianceCategoryRepository {
    findAll(search?: string): Promise<CategoryWithPresetsAndTemplates[]>;
    findById(id: number): Promise<CategoryWithPresetsAndTemplates | null>;
    create(data: CreateApplianceCategoryDto): Promise<ApplianceCategory>;
    update(id: number, data: UpdateApplianceCategoryDto): Promise<ApplianceCategory>;
    delete(id: number): Promise<ApplianceCategory>;
}
