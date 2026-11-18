import { Inject, Injectable } from '@nestjs/common';
import { UpdateTariffCategoryDto } from '../dtos/update-tariff-category.dto.js';
import {
    TARIFF_CATEGORY_REPOSITORY,
    type ITariffCategoryRepository,
} from '../../domain/repositories/tariff-category.repository.interface.js';

@Injectable()
export class UpdateTariffCategoryUseCase {
    constructor(
        @Inject(TARIFF_CATEGORY_REPOSITORY)
        private readonly repository: ITariffCategoryRepository,
    ) { }

    async execute(id: number, dto: UpdateTariffCategoryDto) {
        return this.repository.update(id, dto);
    }
}
