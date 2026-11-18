import { SavingActionTemplate } from '../../../../generated/prisma/client.js';
import { CreateSavingTemplateDto } from '../../application/dtos/create-saving-template.dto.js';
import { UpdateSavingTemplateDto } from '../../application/dtos/update-saving-template.dto.js';

export const SAVING_TEMPLATE_REPOSITORY = 'SAVING_TEMPLATE_REPOSITORY';

export interface ISavingTemplateRepository {
    findAll(categoryId?: number, search?: string): Promise<SavingActionTemplate[]>;
    findById(id: number): Promise<SavingActionTemplate | null>;
    create(data: CreateSavingTemplateDto): Promise<SavingActionTemplate>;
    update(id: number, data: UpdateSavingTemplateDto): Promise<SavingActionTemplate>;
    delete(id: number): Promise<SavingActionTemplate>;
}
