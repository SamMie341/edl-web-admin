import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class CreateAppliancePresetDto {
    @Type(() => Number)
    @IsInt()
    categoryId: number;

    @IsNotEmpty()
    @IsString()
    nameLa: string;

    @IsOptional()
    @IsString()
    nameEn?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    defaultWatt: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    defaultQuantity?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0.1)
    @Max(24)
    defaultHoursPerDay?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(31)
    defaultDaysPerMonth?: number;

    @IsOptional()
    @IsBoolean()
    isSampleDefault?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}
