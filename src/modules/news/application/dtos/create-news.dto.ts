import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { NewsStatus } from '../../../../generated/prisma/enums.js';

export class CreateNewsDto {
    @IsNotEmpty()
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
    subtitleLa?: string;

    @IsOptional()
    @IsString()
    subtitleEn?: string;

    @IsOptional()
    @IsString()
    coverImage?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    galleryImages?: string[];

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsNotEmpty()
    @IsString()
    contentLa: string;

    @IsOptional()
    @IsString()
    contentEn?: string;

    @IsOptional()
    @IsDateString()
    publishedAt?: string;

    @IsOptional()
    @IsEnum(NewsStatus)
    status?: NewsStatus;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    tagIds?: number[];
}