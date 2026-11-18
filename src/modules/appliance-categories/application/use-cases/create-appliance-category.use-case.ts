import { Inject, Injectable } from '@nestjs/common';
import {
    APPLIANCE_CATEGORY_REPOSITORY,
    type IApplianceCategoryRepository,
} from '../../domain/repositories/appliance-category.repository.interface.js';
import { CreateApplianceCategoryDto } from '../dtos/create-appliance-category.dto.js';

@Injectable()
export class CreateApplianceCategoryUseCase {
    constructor(
        @Inject(APPLIANCE_CATEGORY_REPOSITORY)
        private readonly repository: IApplianceCategoryRepository,
    ) { }

    async execute(dto: CreateApplianceCategoryDto) {
        return this.repository.create(dto);
    }
}
