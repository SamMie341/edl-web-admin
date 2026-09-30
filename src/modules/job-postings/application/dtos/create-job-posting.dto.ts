import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { JobPostingStatus } from '../../../../generated/prisma/enums.js';

export class CreateJobPostingDto {
    @IsNotEmpty()
    @IsInt()
    positionId: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    subtitle?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @IsDateString()
    endDate: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(JobPostingStatus)
    status?: JobPostingStatus;
}