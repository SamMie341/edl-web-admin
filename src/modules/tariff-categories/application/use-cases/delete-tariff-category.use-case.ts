import { Inject, Injectable } from '@nestjs/common';
import {
    TARIFF_CATEGORY_REPOSITORY,
    type ITariffCategoryRepository,
} from '../../domain/repositories/tariff-category.repository.interface.js';

@Injectable()
export class DeleteTariffCategoryUseCase {
    constructor(
        @Inject(TARIFF_CATEGORY_REPOSITORY)
        private readonly repository: ITariffCategoryRepository,
    ) { }

    async execute(id: number) {
        return this.repository.delete(id);
    }
}
