import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class CreateTariffCategoryDto {
    @IsNotEmpty()
    @IsString()
    nameLa: string;

    @IsOptional()
    @IsString()
    nameEn?: string;

    @IsOptional()
    @IsString()
    categoryGroup?: string;

    @IsOptional()
    @IsString()
    voltageLevel?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}
