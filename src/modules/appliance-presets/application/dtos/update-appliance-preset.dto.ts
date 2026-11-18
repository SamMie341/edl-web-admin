import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class UpdateAppliancePresetDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @IsString()
    nameLa?: string;

    @IsOptional()
    @IsString()
    nameEn?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    defaultWatt?: number;

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
