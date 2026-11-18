import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    APPLIANCE_CATEGORY_REPOSITORY,
    type IApplianceCategoryRepository,
} from '../../domain/repositories/appliance-category.repository.interface.js';

@Injectable()
export class GetApplianceCategoryByIdUseCase {
    constructor(
        @Inject(APPLIANCE_CATEGORY_REPOSITORY)
        private readonly repository: IApplianceCategoryRepository,
    ) { }

    async execute(id: number) {
        const item = await this.repository.findById(id);
        if (!item) {
            throw new NotFoundException(`Appliance category ID ${id} not found`);
        }
        return item;
    }
}
