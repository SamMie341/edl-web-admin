import { Inject, Injectable } from '@nestjs/common';
import { UpdateSavingTemplateDto } from '../dtos/update-saving-template.dto.js';
import {
    SAVING_TEMPLATE_REPOSITORY,
    type ISavingTemplateRepository,
} from '../../domain/repositories/saving-template.repository.interface.js';

@Injectable()
export class UpdateSavingTemplateUseCase {
    constructor(
        @Inject(SAVING_TEMPLATE_REPOSITORY)
        private readonly repository: ISavingTemplateRepository,
    ) { }

    async execute(id: number, dto: UpdateSavingTemplateDto) {
        return this.repository.update(id, dto);
    }
}
