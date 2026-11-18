import { Inject, Injectable } from '@nestjs/common';
import {
    SAVING_TEMPLATE_REPOSITORY,
    type ISavingTemplateRepository,
} from '../../domain/repositories/saving-template.repository.interface.js';

@Injectable()
export class DeleteSavingTemplateUseCase {
    constructor(
        @Inject(SAVING_TEMPLATE_REPOSITORY)
        private readonly repository: ISavingTemplateRepository,
    ) { }

    async execute(id: number) {
        return this.repository.delete(id);
    }
}
