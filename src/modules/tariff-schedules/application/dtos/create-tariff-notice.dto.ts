import {
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class CreateTariffNoticeDto {
    @IsNotEmpty()
    @IsString()
    noticeNumber: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsDateString()
    issuedDate: string;

    @IsDateString()
    effectiveFrom: string;

    @IsOptional()
    @IsDateString()
    effectiveTo?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(1)
    vatRate?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    hotSeasonDiscountCapKwh?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maintenanceFeeKip?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}
