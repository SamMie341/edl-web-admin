import { PartialType } from '@nestjs/mapped-types';
import { CreateElectricityTariffDto } from './create-electricity-tariff.dto.js';

export class UpdateElectricityTariffDto extends PartialType(CreateElectricityTariffDto) { }