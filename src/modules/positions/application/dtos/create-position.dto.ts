import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class CreatePositionDto {
    @IsNotEmpty()
    @IsString()
    positionName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}