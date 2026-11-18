import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    TARIFF_CATEGORY_REPOSITORY,
    type ITariffCategoryRepository,
} from '../../domain/repositories/tariff-category.repository.interface.js';

@Injectable()
export class GetTariffCategoryByIdUseCase {
    constructor(
        @Inject(TARIFF_CATEGORY_REPOSITORY)
        private readonly repository: ITariffCategoryRepository,
    ) { }

    async execute(id: number) {
        const item = await this.repository.findById(id);
        if (!item) {
            throw new NotFoundException(`Tariff category ID ${id} not found`);
        }
        return item;
    }
}
