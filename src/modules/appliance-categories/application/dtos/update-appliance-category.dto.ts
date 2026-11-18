import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class UpdateApplianceCategoryDto {
    @IsOptional()
    @IsString()
    nameLa?: string;

    @IsOptional()
    @IsString()
    nameEn?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}
