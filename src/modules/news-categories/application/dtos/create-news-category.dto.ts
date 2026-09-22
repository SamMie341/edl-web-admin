import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class CreateNewsCategoryDto {
    @IsNotEmpty()
    @IsString()
    categoryName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}