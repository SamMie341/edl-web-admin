import { Inject, Injectable } from '@nestjs/common';
import { CreateSavingTemplateDto } from '../dtos/create-saving-template.dto.js';
import {
    SAVING_TEMPLATE_REPOSITORY,
    type ISavingTemplateRepository,
} from '../../domain/repositories/saving-template.repository.interface.js';

@Injectable()
export class CreateSavingTemplateUseCase {
    constructor(
        @Inject(SAVING_TEMPLATE_REPOSITORY)
        private readonly repository: ISavingTemplateRepository,
    ) { }

    async execute(dto: CreateSavingTemplateDto) {
        return this.repository.create(dto);
    }
}
