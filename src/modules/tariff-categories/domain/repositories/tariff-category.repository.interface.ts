import { TariffCategory } from '../../../../generated/prisma/client.js';
import { CreateTariffCategoryDto } from '../../application/dtos/create-tariff-category.dto.js';
import { UpdateTariffCategoryDto } from '../../application/dtos/update-tariff-category.dto.js';

export const TARIFF_CATEGORY_REPOSITORY = 'TARIFF_CATEGORY_REPOSITORY';

export interface ITariffCategoryRepository {
    findAll(): Promise<TariffCategory[]>;
    findById(id: number): Promise<TariffCategory | null>;
    create(data: CreateTariffCategoryDto): Promise<TariffCategory>;
    update(id: number, data: UpdateTariffCategoryDto): Promise<TariffCategory>;
    delete(id: number): Promise<TariffCategory>;
}
