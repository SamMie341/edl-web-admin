import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class CreateApplianceCategoryDto {
    @IsNotEmpty()
    @IsString()
    nameLa: string;

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
