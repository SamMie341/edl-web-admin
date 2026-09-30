import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TariffType, TariffStatus } from '../../../../generated/prisma/enums.js';

export class CreateElectricityTariffDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsEnum(TariffType)
    tariffType: TariffType;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    pdfUrl?: string;

    @IsOptional()
    @IsDateString()
    effectiveDate?: string;

    @IsOptional()
    @IsEnum(TariffStatus)
    status?: TariffStatus;
}