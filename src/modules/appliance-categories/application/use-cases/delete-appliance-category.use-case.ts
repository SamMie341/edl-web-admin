import { Inject, Injectable } from '@nestjs/common';
import {
    APPLIANCE_CATEGORY_REPOSITORY,
    type IApplianceCategoryRepository,
} from '../../domain/repositories/appliance-category.repository.interface.js';

@Injectable()
export class DeleteApplianceCategoryUseCase {
    constructor(
        @Inject(APPLIANCE_CATEGORY_REPOSITORY)
        private readonly repository: IApplianceCategoryRepository,
    ) { }

    async execute(id: number) {
        return this.repository.delete(id);
    }
}
