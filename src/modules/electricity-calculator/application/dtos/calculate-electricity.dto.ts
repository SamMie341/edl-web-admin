import {
    IsArray,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApplianceCalculationInputDto } from './appliance-calculation-input.dto.js';

export class CalculateElectricityDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(2020)
    @Max(2050)
    year?: number = 2026;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(12)
    month?: number = 11;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    directMonthlyKwh?: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ApplianceCalculationInputDto)
    appliances?: ApplianceCalculationInputDto[];

    @IsOptional()
    @IsArray()
    @Type(() => Number)
    @IsInt({ each: true })
    selectedActionIds?: number[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    selectedActionCodes?: string[];

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maintenanceFeeKip?: number;
}
