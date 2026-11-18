import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    SAVING_TEMPLATE_REPOSITORY,
    type ISavingTemplateRepository,
} from '../../domain/repositories/saving-template.repository.interface.js';

@Injectable()
export class GetSavingTemplateByIdUseCase {
    constructor(
        @Inject(SAVING_TEMPLATE_REPOSITORY)
        private readonly repository: ISavingTemplateRepository,
    ) { }

    async execute(id: number) {
        const item = await this.repository.findById(id);
        if (!item) {
            throw new NotFoundException(`Saving action template ID ${id} not found`);
        }
        return item;
    }
}
