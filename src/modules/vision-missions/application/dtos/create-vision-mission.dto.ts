import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VisionMissionType, CommonStatus } from '../../../../generated/prisma/enums.js';

export class CreateVisionMissionDto {
    @IsOptional()
    @IsEnum(VisionMissionType)
    entryType?: VisionMissionType;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    slogan?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}