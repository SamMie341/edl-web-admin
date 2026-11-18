import {
    IsDateString,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class UpdateTariffNoticeDto {
    @IsOptional()
    @IsString()
    noticeNumber?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsDateString()
    issuedDate?: string;

    @IsOptional()
    @IsDateString()
    effectiveFrom?: string;

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
