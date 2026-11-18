import { Inject, Injectable } from '@nestjs/common';
import {
    APPLIANCE_CATEGORY_REPOSITORY,
    type IApplianceCategoryRepository,
} from '../../domain/repositories/appliance-category.repository.interface.js';

@Injectable()
export class GetApplianceCategoriesUseCase {
    constructor(
        @Inject(APPLIANCE_CATEGORY_REPOSITORY)
        private readonly repository: IApplianceCategoryRepository,
    ) { }

    async execute(search?: string) {
        return this.repository.findAll(search);
    }
}
