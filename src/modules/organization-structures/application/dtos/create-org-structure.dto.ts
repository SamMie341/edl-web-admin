import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommonStatus, StructureType } from '../../../../generated/prisma/enums.js';

export class CreateOrgStructureDto {
    @IsNotEmpty()
    @IsEnum(StructureType)
    structureType: StructureType;

    @IsNotEmpty()
    @IsString()
    structureName: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    chartData?: any;

    @IsOptional()
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}
