import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ApplianceCalculationInputDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @IsString()
    categoryCode?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    presetId?: number;

    @IsOptional()
    @IsString()
    presetCode?: string;

    @IsOptional()
    @IsString()
    customName?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    watt: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity: number = 1;

    @Type(() => Number)
    @IsNumber()
    @Min(0.1)
    @Max(24)
    hoursPerDay: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(31)
    daysPerMonth: number = 30;
}
