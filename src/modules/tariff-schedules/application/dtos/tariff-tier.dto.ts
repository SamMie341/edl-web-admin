import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TariffTierInputDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    tierOrder: number;

    @IsNotEmpty()
    @IsString()
    label: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    minKwh: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    maxKwh?: number | null;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    rateKipPerKwh: number;
}
