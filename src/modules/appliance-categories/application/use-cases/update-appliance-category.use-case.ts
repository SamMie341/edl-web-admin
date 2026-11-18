import { Inject, Injectable } from '@nestjs/common';
import {
    APPLIANCE_CATEGORY_REPOSITORY,
    type IApplianceCategoryRepository,
} from '../../domain/repositories/appliance-category.repository.interface.js';
import { UpdateApplianceCategoryDto } from '../dtos/update-appliance-category.dto.js';

@Injectable()
export class UpdateApplianceCategoryUseCase {
    constructor(
        @Inject(APPLIANCE_CATEGORY_REPOSITORY)
        private readonly repository: IApplianceCategoryRepository,
    ) { }

    async execute(id: number, dto: UpdateApplianceCategoryDto) {
        return this.repository.update(id, dto);
    }
}
