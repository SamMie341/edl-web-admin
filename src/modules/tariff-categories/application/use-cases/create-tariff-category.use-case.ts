import { Inject, Injectable } from '@nestjs/common';
import { CreateTariffCategoryDto } from '../dtos/create-tariff-category.dto.js';
import {
    TARIFF_CATEGORY_REPOSITORY,
    type ITariffCategoryRepository,
} from '../../domain/repositories/tariff-category.repository.interface.js';

@Injectable()
export class CreateTariffCategoryUseCase {
    constructor(
        @Inject(TARIFF_CATEGORY_REPOSITORY)
        private readonly repository: ITariffCategoryRepository,
    ) { }

    async execute(dto: CreateTariffCategoryDto) {
        return this.repository.create(dto);
    }
}
