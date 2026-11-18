import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsInt,
    IsNumber,
    IsOptional,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TariffTierInputDto } from './tariff-tier.dto.js';

export class UpsertTariffScheduleDto {
    @Type(() => Number)
    @IsInt()
    noticeId: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @Type(() => Number)
    @IsInt()
    @Min(2020)
    @Max(2050)
    year: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(12)
    month: number;

    @IsOptional()
    @IsBoolean()
    isHotSeason?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maintenanceFeeKip?: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TariffTierInputDto)
    tiers: TariffTierInputDto[];
}
