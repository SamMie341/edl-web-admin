import { Inject, Injectable } from '@nestjs/common';
import {
    TARIFF_CATEGORY_REPOSITORY,
    type ITariffCategoryRepository,
} from '../../domain/repositories/tariff-category.repository.interface.js';

@Injectable()
export class GetTariffCategoriesUseCase {
    constructor(
        @Inject(TARIFF_CATEGORY_REPOSITORY)
        private readonly repository: ITariffCategoryRepository,
    ) { }

    async execute() {
        return this.repository.findAll();
    }
}
