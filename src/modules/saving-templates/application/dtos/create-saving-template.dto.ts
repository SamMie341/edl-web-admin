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
import { CommonStatus, EffortLevel, SavingRuleType } from '../../../../generated/prisma/enums.js';

export class CreateSavingTemplateDto {
    @Type(() => Number)
    @IsInt()
    categoryId: number;

    @IsNotEmpty()
    @IsString()
    titleLa: string;

    @IsOptional()
    @IsString()
    titleEn?: string;

    @IsOptional()
    @IsString()
    descriptionLa?: string;

    @IsOptional()
    @IsString()
    descriptionEn?: string;

    @IsEnum(EffortLevel)
    effortLevel: EffortLevel;

    @IsEnum(SavingRuleType)
    ruleType: SavingRuleType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(1)
    fixedFraction?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0.1)
    @Max(24)
    reduceHoursBy?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    targetWattLow?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    targetWattHigh?: number;

    @IsOptional()
    @IsBoolean()
    defaultSelected?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}
